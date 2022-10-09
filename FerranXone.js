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

XoneChain.capturableComponents = {};

XoneChain.Channel = function (i, channel) {
    console.log("Channel constructor")
    this.group = "[Channel" + (i + 1) + "]";
    this.eqGroup = "[EqualizerRack1_" + this.group + "_Effect1]"

    this.eqHigh = new components.Pot({
        group: this.eqGroup,
        inKey: "parameter3"
    })

    this.eqMid = new components.Pot({
        group: this.eqGroup,
        inKey: "parameter2"
    })

    this.eqLow = new components.Pot({
        group: this.eqGroup,
        inKey: "parameter1"
    })

    this.fader = new components.Pot({
        group: this.group,
        inKey: "volume"
    })

    this.mute = new capturable.CapturableButton({
        id: "muteButton",
        group: this.group,
        inKey: "mute",
        outKey: "mute",
        // TODO: midi specified here?
        midi: [midi.noteOn + channel, controllers.k1_1[i].button4],
        type: components.Button.prototype.types.toggle
    })

    var self = this
    this.map = function () {
        console.log("Channel map")

        XoneChain.mapping.map(
            channel,
            controllers.k1_1[i].knob1,
            "all",
            self.eqHigh
        );

        XoneChain.mapping.map(
            channel,
            controllers.k1_1[i].knob2,
            "all",
            self.eqMid
        );

        XoneChain.mapping.map(
            channel,
            controllers.k1_1[i].knob3,
            "all",
            self.eqLow
        );

        XoneChain.mapping.map(
            channel,
            controllers.k1_1[i].fader,
            "all",
            self.fader
        );

        XoneChain.mapping.map(
            channel,
            controllers.k1_1[i].button4,
            "all",
            self.mute
        );

        // TODO: this is ugly
        XoneChain.capturableComponents.mute = this.mute;
    }
};

XoneChain.init = function() {
    components.Button.prototype.isPress = function (channel, control, value, status) {
        return (status & 0xF0) === midi.noteOn;
    };

    XoneChain[0] = new XoneChain.Channel(0, 0);
    XoneChain[1] = new XoneChain.Channel(1, 0);
    XoneChain[2] = new XoneChain.Channel(2, 0);
    XoneChain[3] = new XoneChain.Channel(3, 0);
    // XoneChain[4] = new XoneChain.Channel(4, 1);
    // XoneChain[5] = new XoneChain.Channel(5, 1);

    XoneChain.controlComboGroup = new controlcombo.ControlComboGroup({
        numberOfControlCombos: 4,
        components: XoneChain.capturableComponents
    });

    XoneChain.mapping = new mapper.MidiMapper();
    XoneChain.mappingInit();
};


// Mapping
// =======
var valueOff = controllers.spectra.off;

XoneChain.mapControlComboShift = function (parameters) {
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

XoneChain.mapControlComboTrigger = function (parameters) {
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

XoneChain.mappingInit = function () {
    console.log("Mapping init")

    // ControlCombo 1
    XoneChain.mapControlComboShift({
        i:          0,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[2].button4,
    });
    XoneChain.mapControlComboTrigger({
        i:          0,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[3].button4,
    });

    // ControlCombo 2
    XoneChain.mapControlComboShift({
        i:          1,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[2].button5,
    });
    XoneChain.mapControlComboTrigger({
        i:          1,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[3].button5,
    });

    // ControlCombo 3
    XoneChain.mapControlComboShift({
        i:          2,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[2].button6,
    });
    XoneChain.mapControlComboTrigger({
        i:          2,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[3].button6,
    });

    // ControlCombo 4
    XoneChain.mapControlComboShift({
        i:          3,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[2].button7,
    });
    XoneChain.mapControlComboTrigger({
        i:          3,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[3].button7,
    });

    for (var i = 0; i < 4; ++i) {
        XoneChain[i].map();
    }
};