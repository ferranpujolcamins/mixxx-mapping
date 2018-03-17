;(function (global) {

    _.create = function(a, b) {
        var temp = Object.create(a);
        _.assign(temp, b);
        return temp;
    }

    // TODO: proper prototyping and constructor in components

    // TODO: full lodash build for mixxx

    /**
     * ControlComboButton
     * @param {Object} properties
     * @param {ControlCombo} properties.controlCombo - The ControlCombo that holds this button,
     * @param {function} properties.onPress - Function to call when the button is pressed.
     * @param {function} properties.onRelease - Function to call when the button is released.
     * @param {number} [properties.valueOn=127] - The midi value to send when the button is pressed.
     * @param {number} [properties.valueLoaded=64] - The midi value to send when the button is not pressed but its ControlCombo has actions assigned.
     * @param {number} [properties.valueOff=0] - The midi value to send when the button is not pressed and its ControlCombo has no actions assigned.
     * @constructor
     */
    var ControlComboButton = function(properties) {

        this.isOn = false;
        this.valueOn = 127;
        this.valueLoaded = 64;
        this.valueOff = 0;
        this.onPress = function () {};
        this.onRelease = function () {};

        components.Button.call(this, properties);
    };

    ControlComboButton.prototype = _.create(components.Button.prototype, {

        constructor: ControlComboButton,

        inSetValue: function(isPress) {
            if (isPress) {
                this.isOn = true;
                this.onPress();
                this.sendOutput();
            } else {
                this.isOn = false;
                this.onRelease();
                this.sendOutput();
            }
        },

        sendOutPut: function() {}
    });


    /**
     * ControlComboShiftButton
     * @param {Object} properties
     * @constructor
     */
    var ControlComboShiftButton = function(properties) {

        ControlComboButton.call(this, properties);
    };

    ControlComboShiftButton.prototype = _.create(ControlComboButton.prototype, {

        constructor: ControlComboShiftButton,

        sendOutput: function () {
            if (this.isOn === true) {
                this.send(this.valueOn);
            } else if (this.controlCombo.isLoaded) {
                this.send(this.valueLoaded);
            } else {
                this.send(this.valueOff);
            }
        },

        unselect: function () {
            this.isOn = false;
            this.sendOutput();
        }
    });


    /**
     * ControlComboTriggerButton
     * @param {Object} properties
     * @constructor
     */
    var ControlComboTriggerButton = function(properties) {

        ControlComboButton.call(this, properties);

        this.animationStep = 0;
        this.timer = null;
    };

    ControlComboTriggerButton.prototype = _.create(ControlComboButton.prototype, {

        constructor: ControlComboTriggerButton,

        sendOutput: function () {

        },

        animate: function() {
            if (this.timer === null) {
                this.animation();
            }
        },

        // TODO: encapsulate in TimedSequence class or something like that
        animation: function() {
            var self = this;
            if (self.animationStep == 0 && self.timer === null) {
                self.timer = engine.beginTimer(25, function() {self.animation()});
                this.send(controllers.spectra.yellow);
                self.animationStep += 1;
            } else if (self.animationStep == 1) {
                this.send(this.valueOff);
                self.animationStep += 1;
            } else if (self.animationStep == 2) {
                this.send(controllers.spectra.red);
                self.animationStep += 1;
            } else if (self.animationStep == 3) {
                this.send(this.valueOff);
                self.animationStep += 1;
            } else if (self.animationStep == 4) {
                this.send(controllers.spectra.teal);
                self.animationStep += 1;
            } else if (self.animationStep == 5) {
                this.send(this.valueOff);
                if (self.timer !== null) {
                    engine.stopTimer(self.timer);
                    self.timer = null;
                }
                self.animationStep = 0;
            }
        }
    });


    /**
     * ControlCombo
     * @param {Object} properties
     * @param {ControlComboGroup} properties.controlComboGroup - The ControlComboGroup that holds this ControlCombo.
     * @param {number} properties.id - A number that the ControlComboGroup uses to identify each ControlCombo instance it holds.
     * @constructor
     */
    var ControlCombo = function(properties) {

        var self = this;

        _.assign(self, properties);

        self.shiftButton = new ControlComboShiftButton({
            controlCombo: self,
            onPress: function () { self.shiftPressed(); },
            onRelease: function () { self.shiftReleased(); }
        });
        self.triggerButton = new ControlComboTriggerButton({
            controlCombo: self,
            onPress: function () { self.triggerPressed(); },
        });
        self.isLoaded = false;
        self.shiftOn = false;
    };

    ControlCombo.prototype = {

        shiftPressed: function () {
            this.shiftOn = true;
            this.controlComboGroup.controlComboSelected(this.id);
        },

        shiftReleased: function () {
            this.shiftOn = false;
            this.controlComboGroup.controlComboUnSelected(this.id);
        },

        triggerPressed: function () {
            if (this.triggerButton.isOn === true &&
                !this.shiftOn && this.isLoaded) {
                this.triggerButton.animate();
                this.isLoaded = false;
                this.shiftButton.sendOutput();
            }
        },

        unselect: function () {
            this.shiftButton.unselect();
        },

        captureMessage: function (component, channel, control, value, status, group) {
            print("capture");
            this.isLoaded = true;
        }
    };


    /**
     * ControlComboGroup
     * @param {Object} properties
     * @param {number} properties.numberOfControlCombos - Number of ControlCombos that will make up the ControlComboGroup.
     * @param {Object} properties.components
     * @constructor
     */
    var ControlComboGroup = function(properties) {

        var self = this;

        _.assign(self, properties);
        self.components = new components.ComponentContainer(properties.components);

        for (var id = 0; id < self.numberOfControlCombos; ++id) {
    
            self[id] = new ControlCombo({
                controlComboGroup: self,
                id: id,
            });
        }

        // Set self as proxy to the buttons input
        this.components.forEachComponent(function (component) {
            if (component instanceof components.Button) {
                var componentInput = component.input;
                // TODO: overwriting the input function is dangerous because other libraries might do the same
                component.input = function (channel, control, value, status, group) {
                    if (self.activeShiftButton !== null) {
                        self.captureMessage(component, channel, control, value, status, group);
                    } else {
                        componentInput.call(component, channel, control, value, status, group);
                    }
                }
            }
            // && (component.type === Button.prototype.types.push
            //     || component.type === undefined)
            // && component.input === Button.prototype.input
        }, true);
    
        self.activeShiftButton = null;
    };

    ControlComboGroup.prototype = {

        controlComboSelected: function(id) {
            this.activeShiftButton = id;

            for (var i = 0; i < this.numberOfControlCombos; ++i) {
                if (i !== id) {
                    this[i].unselect();
                }
            }
        },

        controlComboUnSelected: function(id) {
            if (this.activeShiftButton == id) {
                this.activeShiftButton = null;
            }
        },

        captureMessage: function(component, channel, control, value, status, group) {
            if (this.activeShiftButton == null) { return; }

            this[this.activeShiftButton].captureMessage(component, channel, control, value, status, group);

        }
    };

    var exports = {};
    exports.ControlComboButton = ControlComboShiftButton;
    exports.ControlCombo = ControlCombo;
    exports.ControlComboGroup = ControlComboGroup;
    global.controlcombo = exports;

}(this));
