/*
//=============================================================================
// ControlComboShiftButton
//=============================================================================

var ControlComboShiftButton = function(controlCombo) {

    this.controlCombo = controlCombo;
};

ControlComboShiftButton.prototype = new components.Button({

    inSetValue: function(isPress) {
        if (isPress) {
            this.controlCombo.shiftPressed();
        } else {
            this.controlCombo.shiftReleased();
        }
    },
});

//=============================================================================
// ControlComboTriggerButton
//=============================================================================

var ControlComboTriggerButton = function(controlCombo) {

};

ControlComboTriggerButton.prototype = new components.Button({

});

//=============================================================================
// ControlCombo
//=============================================================================

var ControlCombo = function(properties) {
    
    _.assign(this, properties);

    this.controlComboGroup = null;
    this.id = null;
    this.shiftButton = null;
    this.triggerButton =null;
};

ControlCombo.prototype = {
    
    shiftPressed: function() {
        this.controlComboGroup.shiftPressed(this.id);
    },
    
    shiftReleased: function() {
        this.controlComboGroup.shiftReleased(this.id);
    }
};

//=============================================================================
// ControlComboGroup
//=============================================================================

var ControlComboGroup = function(controlComboButtonsList) {

    this.controlComboList = [];

    var controlComboId = 0;

    controlComboButtonsList.forEach(function(controlCombo) {

        // TODO: use lodash create
        _.assign(controlCombo, {controlComboGroup: this, id: controlComboId});
        this.controlComboList.push(new ControlCombo(controlCombo));
        controlComboId += 1;

    }, this);

    this.activeShiftButton = null;
};

ControlComboGroup.prototype = {

    shiftPressed: function(id) {
        this.activeShiftButton = id;
    },
    
    shiftReleased: function(id) {
        if (this.activeShiftButton == id) {
            this.activeShiftButton = null;
        }
    }
};



var test = function() {

    this.comboGroup = new ControlComboGroup([
        {
            shiftButton: new ControlComboShiftButton(),
            triggerButton: new ControlComboTriggerButton(),
        },
        {
            shiftButton: new ControlComboShiftButton(),
            triggerButton: new ControlComboTriggerButton(),
        },
        {
            shiftButton: new ControlComboShiftButton(),
            triggerButton: new ControlComboTriggerButton(),
        },
        {
            shiftButton: new ControlComboShiftButton(),
            triggerButton: new ControlComboTriggerButton(),
        },
    ]);
};

*/



var XoneChain = {
};
/*
var midiStatus = {
    noteOn: 0x90,
    noteOff: 0x80,
};

var Mapping = function(parameters) {
    var self = this;
    parameters.forEach(function(element) {
        _set(self, element[0], element[1]);
    });
};

// Channel -> control -> (status)

XoneChain.mapping = new Mapping([

    ["3.25.noteOn", function() {
        print("1A");
    }],

    ["3.25.noteOff", function() {
        print("1B");
    }],

    ["3.26", function() {
        print("2");
    }],
]);


XoneChain.mapping[3][0x25][midiStatus.noteOn] = function() {
    print("1A");
};

XoneChain.mapping[3][0x25][midiStatus.noteOff] = function() {
    print("1B");
};

XoneChain.mapping[3][0x26] = function() {
    print("2");
};
*/

/*
XoneChain.comboGroup = new ControlComboGroup([
    {
        shiftButton: new ControlComboShiftButton(),
        triggerButton: new ControlComboTriggerButton(),
    },
    {
        shiftButton: new ControlComboShiftButton(),
        triggerButton: new ControlComboTriggerButton(),
    },
    {
        shiftButton: new ControlComboShiftButton(),
        triggerButton: new ControlComboTriggerButton(),
    },
    {
        shiftButton: new ControlComboShiftButton(),
        triggerButton: new ControlComboTriggerButton(),
    },
]);
*/

XoneChain.mapping = new mapping.Mapping();

XoneChain.mapping.map(2, 0x24, midi.status.noteOn, function(value) {
    print("1A " + value);
});

XoneChain.mapping.map(2, 0x24, midi.status.noteOff, function(value) {
    print("1B " + value);
});

XoneChain.mapping.map(2, 0x25, null, function(status, value) {
    print("2 " + status + " " + value);
});

XoneChain.mapping.map(2, 0x26, midi.status.on, function(value) {
    print("3 " + value);
});

XoneChain.mapping.map(2, 0x27, midi.status.off, function(value) {
    print("4 " + value);
});

XoneChain.input = function (channel, control, value, status, group) {
    XoneChain.mapping.trigger(channel, control, value, status);
};
