var XoneChain = {
};

midi.noteOn = 0x90;
midi.on = 0x90;
midi.noteOff = 0x80;
midi.off = 0x80;
midi.keyPressure = 0xA0;
midi.kp = 0xA0;
midi.controlChange = 0xB0;
midi.cc = 0xB0;

XoneChain.controlComboGroup = new controlcombo.ControlComboGroup({
    numberOfControlCombos: 4,
    components: {
        sillyButton: new components.Button({
            input: function (channel, control, value, status, group) {
                print("button do something");
            }
        })
    }
});

XoneChain.mapping = new mapper.MidiMapper();

XoneChain.init = function() {
    components.Button.prototype.isPress = function (channel, control, value, status) {
        return (status & 0xF0) === midi.noteOn;
    };

    XoneChain.mapping.init();
};


// Mapping
// =======
var valueOff = controllers.spectra.off;

XoneChain.mapping.mapControlComboShift = function(parameters) {
    var i = parameters.i;
    var channel = parameters.channel;
    var control = parameters.control;

    var valueOn = controllers.spectra.pink;
    var valueLoaded = controllers.spectra.dimTeal;

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
    XoneChain.controlComboGroup[i].shiftButton.valueOn = valueOn;
    XoneChain.controlComboGroup[i].shiftButton.valueLoaded = valueLoaded;
    XoneChain.controlComboGroup[i].shiftButton.valueOff = valueOff;
};

XoneChain.mapping.mapControlComboTrigger = function(parameters) {
    var i = parameters.i;
    var channel = parameters.channel;
    var control = parameters.control;

    var valueOn = controllers.spectra.red;
    var valueLoaded = controllers.spectra.dimRed;

    XoneChain.mapping.map(
        channel,
        control,
        "all",
        function(channel, control, value, status, group) {
            XoneChain.controlComboGroup[i].triggerButton.input(channel, control, value, status, group);
        }
    );
    XoneChain.controlComboGroup[i].triggerButton.midi = [
        channel + midi.noteOn,
        control
    ];
    XoneChain.controlComboGroup[i].triggerButton.valueOn = valueOn;
    XoneChain.controlComboGroup[i].triggerButton.valueLoaded = valueLoaded;
    XoneChain.controlComboGroup[i].triggerButton.valueOff = valueOff;
};

XoneChain.mapping.init = function() {

    XoneChain.mapping.map(
        controllers.spectra.channel,
        controllers.spectra[1][0],
        "all",
        function(channel, control, value, status, group) {
            XoneChain.controlComboGroup.components.sillyButton.input(channel, control, value, status, group);
        }
    );

    // ControlCombo 1
    XoneChain.mapping.mapControlComboShift({
        i:          0,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[2][0],
    });
    XoneChain.mapping.mapControlComboTrigger({
        i:          0,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[3][0],
    });

    // ControlCombo 2
    XoneChain.mapping.mapControlComboShift({
        i:          1,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[2][1],
    });
    XoneChain.mapping.mapControlComboTrigger({
        i:          1,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[3][1],
    });

    // ControlCombo 3
    XoneChain.mapping.mapControlComboShift({
        i:          2,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[2][2],
    });
    XoneChain.mapping.mapControlComboTrigger({
        i:          2,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[3][2],
    });

    // ControlCombo 4
    XoneChain.mapping.mapControlComboShift({
        i:          3,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[2][3],
    });
    XoneChain.mapping.mapControlComboTrigger({
        i:          3,
        channel:    controllers.spectra.channel,
        control:    controllers.spectra[3][3],
    });

};