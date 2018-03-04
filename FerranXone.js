var XoneChain = {
};

midi.noteOn = 0x90;
midi.on = 0x90;
midi.noteOff = 0x80;
midi.off = 0x80;
midi.keyPressure = 0xA0;
midi.kp = 0xA0;
midi.controlChange = 0xB0;
midi.cc == 0xB0;

XoneChain.controlComboGroup = new controlcombo.ControlComboGroup(4);

XoneChain.mapping = new mapper.MidiMapper();

XoneChain.init = function() {
    components.Button.prototype.isPress = function (channel, control, value, status) {
        return (status & 0xF0) === midi.noteOn;
    }

    XoneChain.mapping.init();
};


// Mapping
// =======

XoneChain.mapping.mapControlComboShift = function(parameters) {
    var i = parameters.i;
    var channel = parameters.channel;
    var control = parameters.control;
    var onValue = parameters.onValue;
    var offValue = parameters.offValue;

    XoneChain.mapping.map(
        channel,
        control,
        "all",
        function(channel, control, value, status, group) {
            XoneChain.controlComboGroup[i].shiftButton.input(channel, control, value, status, group);
        }
    );
    XoneChain.controlComboGroup[i].shiftButton.midi = [
        channel + midi.noteOn,
        control
    ];
    XoneChain.controlComboGroup[i].shiftButton.max = onValue;
    XoneChain.controlComboGroup[i].shiftButton.min = offValue;
};

XoneChain.mapping.init = function() {

    // ControlCombo 1
    XoneChain.mapping.mapControlComboShift({
        i:          0,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[2][0],
        onValue:    controllers.spectra.a,
        offValue:   controllers.spectra.off,
    });

    // ControlCombo 2
    XoneChain.mapping.mapControlComboShift({
        i:          1,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[2][1],
        onValue:    controllers.spectra.b,
        offValue:   controllers.spectra.off,
    });

    // ControlCombo 3
    XoneChain.mapping.mapControlComboShift({
        i:          2,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[2][2],
        onValue:    controllers.spectra.green,
        offValue:   controllers.spectra.off,
    });

    // ControlCombo 4
    XoneChain.mapping.mapControlComboShift({
        i:          3,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[2][3],
        onValue:    controllers.spectra.green,
        offValue:   controllers.spectra.off,
    });

};