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

XoneChain.numChannels = 4;

XoneChain.capturableComponents = {};

XoneChain.Encoder = function (options) {
    components.Encoder.call(this);
    _.assign(this, options);
}

XoneChain.Encoder.prototype = _.create(components.Encoder.prototype, {
    'constructor': XoneChain.Encoder,
    'input': function (channel, control, value, _status, _group) {
        var newParam = this.inGetParameter();
        if (value > 64) {
            newParam -= 0.005;
        } else {
            newParam += 0.005;
        }
        this.inSetParameter(newParam);
    }
})

XoneChain.Channel = function (mixxxChannel, controllerChannel, midiChannel) {
    this.group = "[Channel" + (mixxxChannel + 1) + "]";
    this.eqGroup = "[EqualizerRack1_" + this.group + "_Effect1]"

    this.eqHigh = new components.Pot({
        group: this.eqGroup,
        inKey: "parameter3"
    })

    this.eqHighButton = new capturable.CapturableButton({
        id: "eqHighButton" + mixxxChannel,
        group: this.eqGroup,
        key: "button_parameter3",
        midi: [midi.noteOn + midiChannel, controllers.k1_1[controllerChannel].button1],
        type: components.Button.prototype.types.toggle
    })

    this.eqMid = new components.Pot({
        group: this.eqGroup,
        inKey: "parameter2"
    })

    this.eqMidButton = new capturable.CapturableButton({
        id: "eqMidButton" + mixxxChannel,
        group: this.eqGroup,
        key: "button_parameter2",
        midi: [midi.noteOn + midiChannel, controllers.k1_1[controllerChannel].button2],
        type: components.Button.prototype.types.toggle
    })

    this.eqLow = new components.Pot({
        group: this.eqGroup,
        inKey: "parameter1"
    })

    this.eqLowButton = new capturable.CapturableButton({
        id: "eqLowButton" + mixxxChannel,
        group: this.eqGroup,
        key: "button_parameter1",
        midi: [midi.noteOn + midiChannel, controllers.k1_1[controllerChannel].button3],
        type: components.Button.prototype.types.toggle
    })

    this.fader = new components.Pot({
        group: this.group,
        inKey: "volume"
    })

    this.gain = new XoneChain.Encoder({
        group: this.group,
        inKey: "pregain"
    })

    this.mute = new capturable.CapturableButton({
        id: "mute" + mixxxChannel,
        group: this.group,
        key: "mute",
        outValueScale: function (value) { return (1 - value) * this.max; },
        // TODO: midi specified here?
        midi: [midi.noteOn + midiChannel, controllers.k1_1[controllerChannel].button4],
        type: components.Button.prototype.types.toggle
    })

    this.pfl = new components.Button({
        group: this.group,
        key: "pfl",
        midi: [midi.noteOn + midiChannel, controllers.k1_1[controllerChannel].encoderButton],
        type: components.Button.prototype.types.toggle
    })

    this.map = function () {
        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].knob1,
            "all",
            this.eqHigh
        );

        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].button1,
            "all",
            this.eqHighButton
        );

        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].knob2,
            "all",
            this.eqMid
        );

        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].button2,
            "all",
            this.eqMidButton
        );

        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].knob3,
            "all",
            this.eqLow
        );

        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].button3,
            "all",
            this.eqLowButton
        );

        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].fader,
            "all",
            this.fader
        );

        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].encoder,
            "all",
            this.gain
        );

        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].button4,
            "all",
            this.mute
        );

        XoneChain.mapping.map(
            midiChannel,
            controllers.k1_1[controllerChannel].encoderButton,
            "all",
            this.pfl
        );
    }

    this.registerCapturableControls = function () {
        for (property in this) {
            var component = this[property];
            if (component instanceof capturable.CapturableButton) {
                XoneChain.capturableComponents[component.id] = component;
            }
        }
    }
};

XoneChain.init = function() {
    components.Button.prototype.isPress = function (channel, control, value, status) {
        return (status & 0xF0) === midi.noteOn;
    };

    XoneChain[0] = new XoneChain.Channel(2, 0, 0);
    XoneChain[1] = new XoneChain.Channel(0, 1, 0);
    XoneChain[2] = new XoneChain.Channel(1, 2, 0);
    XoneChain[3] = new XoneChain.Channel(3, 3, 0);
    // XoneChain[4] = new XoneChain.Channel(4, 1);
    // XoneChain[5] = new XoneChain.Channel(5, 1);

    XoneChain.mapping = new mapper.MidiMapper();


    // Channels
    for (var i = 0; i < XoneChain.numChannels; ++i) {
        XoneChain[i].registerCapturableControls();
    }

    XoneChain.controlComboGroup = new controlcombo.ControlComboGroup({
        numberOfControlCombos: 4,
        components: XoneChain.capturableComponents
    });

    // Channels
    for (var i = 0; i < XoneChain.numChannels; ++i) {
        XoneChain[i].map();
    }

    // ControlCombo 1
    XoneChain.mapControlComboShift({
        i: 0,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[2].button4,
    });
    XoneChain.mapControlComboTrigger({
        i: 0,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[3].button4,
    });

    // ControlCombo 2
    XoneChain.mapControlComboShift({
        i: 1,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[2].button5,
    });
    XoneChain.mapControlComboTrigger({
        i: 1,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[3].button5,
    });

    // ControlCombo 3
    XoneChain.mapControlComboShift({
        i: 2,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[2].button6,
    });
    XoneChain.mapControlComboTrigger({
        i: 2,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[3].button6,
    });

    // ControlCombo 4
    XoneChain.mapControlComboShift({
        i: 3,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[2].button7,
    });
    XoneChain.mapControlComboTrigger({
        i: 3,
        channel: controllers.k1_2.midiChannel,
        control: controllers.k1_2[3].button7,
    });
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