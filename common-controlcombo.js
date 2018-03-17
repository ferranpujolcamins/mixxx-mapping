;(function (global) {

    _.create = function(a, b) {
        var temp = Object.create(a);
        _.assign(temp, b);
        return temp;
    }

    var state = {
        on: 1,
        off: 0
    }

    // TODO
    // components.ComponentContainer.prototype.constructor = ComponentContainer;

    /**
     * ControlComboShiftButton
     * @param {Object} properties
     * @param {ControlCombo} properties.controlCombo - The ControlCombo that holds this button,
     * @param {function} properties.onValue - The midi value to send when the button is pressed.
     * @param {function} properties.loadedValue - The midi value to send when the button is not pressed but its ControlCombo has actions assigned.
     * @param {function} properties.offValue - The midi value to send when the button is not pressed and its ControlCombo has no actions assigned.
     * @constructor
     */
    var ControlComboShiftButton = function(properties) {

        this.state = state.off;
        this.onValue = 127;
        this.loadedValue = 64;
        this.offValue = 0;

        components.Button.call(this, properties);
    };

    ControlComboShiftButton.prototype = _.create(components.Button.prototype, {

        constructor: ControlComboShiftButton,

        inSetValue: function(isPress) {
            if (isPress) {
                this.state = state.on;
                this.controlCombo.shiftPressed();
                this.sendOutput();
            } else {
                this.state = state.off;
                this.controlCombo.shiftReleased();
                this.sendOutput();
            }
        },

        sendOutput: function () {
            if (this.state === state.on) {
                this.send(this.onValue);
            } else if (this.controlCombo.isLoaded) {
                this.send(this.loadedValue);
            } else {
                this.send(this.offValue);
            }
        },

        unselect: function () {
            this.state = state.off;
            this.sendOutput();
        }
    });



    // ControlComboTriggerButton
    // =======================
    var ControlComboTriggerButton = function(controlCombo) {

        this.controlCombo = controlCombo;
    };
    
    ControlComboTriggerButton.prototype = _.create(components.Button.prototype, {

        constructor: ControlComboTriggerButton,

        inSetValue: function(isPress) {
            if (isPress) {
                this.controlCombo.triggerPressed();
                this.output(1);
            } else {
                this.controlCombo.triggerReleased();
                this.output(0);
            }
        },

        outValueScale: function(value) {
            return value * (this.max - this.min) + this.min;
        },
    });



    /**
     * ControlCombo
     * @param {Object} properties
     * @param {ControlComboGroup} properties.controlComboGroup - The ControlComboGroup that holds this ControlCombo.
     * @param {number} properties.id - A number that the ControlComboGroup uses to identify each ControlCombo instance it holds.
     * @constructor
     */
    var ControlCombo = function(properties) {

        this.shiftButton = new ControlComboShiftButton({controlCombo: this});
        this.triggerButton = new ControlComboTriggerButton({controlCombo: this});
        this.isLoaded = false;

        components.ComponentContainer.call(this, properties);
    };

    ControlCombo.prototype = _.create(components.ComponentContainer.prototype, {

        constructor: ControlCombo,

        shiftPressed: function () {
            this.controlComboGroup.controlComboSelected(this.id);
        },

        shiftReleased: function () {
            this.controlComboGroup.controlComboUnSelected(this.id);
        },

        unselect: function () {
            this.shiftButton.unselect();
        }
    });


    /**
     * ControlComboGroup
     * @param {Object} properties
     * @param {number} properties.numberOfControlCombos - Number of ControlCombos that will make up the ControlComboGroup.
     * @constructor
     */
    var ControlComboGroup = function(properties) {

        this.numberOfControlCombos = properties.numberOfControlCombos;
    
        for (var id = 0; id < this.numberOfControlCombos; ++id) {
    
            this[id] = new ControlCombo({
    
                controlComboGroup: this,
                id: id,
    
            });
        }
    
        this.activeShiftButton = null;
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
    };

    var exports = {};
    exports.ControlComboShiftButton = ControlComboShiftButton;
    exports.ControlComboTriggerButton = ControlComboTriggerButton;
    exports.ControlCombo = ControlCombo;
    exports.ControlComboGroup = ControlComboGroup;
    global.controlcombo = exports;

}(this));
