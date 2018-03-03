var XoneChain = {
};

XoneChain.controlComboGroup = new controlcombo.ControlComboGroup(4);

XoneChain.mapping = new mapping.Mapping();

XoneChain.init = function() {
    components.Button.prototype.isPress = function (channel, control, value, status) {
        return (status & 0xF0) === 0x90;
    }

    XoneChain.controlComboGroup[0].shiftButton.midi = [0x93, 0x28];
    XoneChain.controlComboGroup[0].shiftButton.max = 64;
    XoneChain.controlComboGroup[0].shiftButton.min = 1;

    XoneChain.controlComboGroup[1].shiftButton.midi = [0x93, 0x29];
    XoneChain.controlComboGroup[1].shiftButton.max = 64;
    XoneChain.controlComboGroup[1].shiftButton.min = 1;

    XoneChain.controlComboGroup[2].shiftButton.midi = [0x93, 0x2A];
    XoneChain.controlComboGroup[2].shiftButton.max = 64;
    XoneChain.controlComboGroup[2].shiftButton.min = 1;

    XoneChain.controlComboGroup[3].shiftButton.midi = [0x93, 0x2B];
    XoneChain.controlComboGroup[3].shiftButton.max = 64;
    XoneChain.controlComboGroup[3].shiftButton.min = 1;

    XoneChain.mapping.init();
};


// Mapping
// =======

XoneChain.mapping.init = function() {

    XoneChain.mapping.map(3, 0x28, null, function(channel, control, value, status, group) {
        XoneChain.controlComboGroup[0].shiftButton.input(channel, control, value, status, group);
    });

    XoneChain.mapping.map(3, 0x29, null, function(channel, control, value, status, group) {
        XoneChain.controlComboGroup[1].shiftButton.input(channel, control, value, status, group);
    });

    XoneChain.mapping.map(3, 0x2A, null, function(channel, control, value, status, group) {
        XoneChain.controlComboGroup[2].shiftButton.input(channel, control, value, status, group);
    });

    XoneChain.mapping.map(3, 0x2B, null, function(channel, control, value, status, group) {
        XoneChain.controlComboGroup[3].shiftButton.input(channel, control, value, status, group);
    });

};