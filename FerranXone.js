components.Button.prototype.isPress = function (channel, control, value, status) {
    return (status & 0xF0) === 0x90;
}


var XoneChain = {
};

XoneChain.controlComboGroup = new controlcombo.ControlComboGroup(4);


// Mapping
// =======

XoneChain.mapping = new mapping.Mapping();

XoneChain.mapping.map(2, 0x28, null, function(channel, control, value, status, group) {
    XoneChain.controlComboGroup[0].shiftButton.input(channel, control, value, status, group);
});

XoneChain.mapping.map(2, 0x29, null, function(channel, control, value, status, group) {
    XoneChain.controlComboGroup[1].shiftButton.input(channel, control, value, status, group);
});