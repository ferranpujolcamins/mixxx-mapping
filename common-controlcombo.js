;(function (global) {

    // ControlComboShiftButton
    // =======================

    var ControlComboShiftButton = function(controlCombo) {

        this.controlCombo = controlCombo;
    };
    
    ControlComboShiftButton.prototype = new components.Button({
    
        inSetValue: function(isPress) {
            if (isPress) {
                this.controlCombo.shiftPressed();
                this.output(1);
            } else {
                this.controlCombo.shiftReleased();
                this.output(0);
            }
        },

        outValueScale: function(value) {
            return value * (this.max - this.min) + this.min;
        },

        turnOff: function() {
            this.output(0);
        },
    });



    // ControlComboShiftButton
    // =======================
    var ControlComboTriggerButton = function(controlCombo) {

    };
    
    ControlComboTriggerButton.prototype = new components.Button({
    
    });



    // ControlCombo
    // ============

    var ControlCombo = function(properties) {

        this.controlComboGroup = undefined;
        this.id = undefined;
        this.shiftButton = new ControlComboShiftButton(this),
        this.triggerButton = new ControlComboTriggerButton(this),
    
        _.assign(this, properties);
    };
    
    ControlCombo.prototype = {
        
        shiftPressed: function() {
            this.controlComboGroup.shiftPressed(this.id);
        },
        
        shiftReleased: function() {
            this.controlComboGroup.shiftReleased(this.id);
        },
    };



    // ControlComboGroup
    // =================

    var ControlComboGroup = function(numberOfControlCombos) {

        this.numberOfControlCombos = numberOfControlCombos;
    
        for (var id = 0; id < numberOfControlCombos; ++id) {
    
            this[id] = new ControlCombo({
    
                controlComboGroup: this,
                id: id,
    
            });
        };
    
        this.activeShiftButton = null;
    };
    
    ControlComboGroup.prototype = {
    
        shiftPressed: function(id) {
            this.activeShiftButton = id;

            for (var i = 0; i < this.numberOfControlCombos; ++i) {
                if (i !== id) {
                    // this[i].shiftButton.turnOff();
                }
            }
        },
        
        shiftReleased: function(id) {
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
