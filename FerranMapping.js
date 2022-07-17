var FerranMapping = {
};

midi.noteOn = 0x90;
midi.on = 0x90;
midi.noteOff = 0x80;
midi.off = 0x80;
midi.keyPressure = 0xA0;
midi.kp = 0xA0;
midi.controlChange = 0xB0;
midi.cc = 0xB0;

FerranMapping.mapping = new mapper.MidiMapper();

FerranMapping.init = function () {
    components.Button.prototype.isPress = function (channel, control, value, status) {
        return (status & 0xF0) === midi.noteOn;
    };

    this.volume = new components.Pot({
        id: "volume",
        group: '[Channel1]',
        inKey: 'volume'
    });

    FerranMapping.mapping.init();
};


// Mapping
// =======
var valueOff = controllers.spectra.off;

FerranMapping.mapping.init = function () {
    FerranMapping.mapping.map(
        controllers.k1.channel,
        controllers.k1[0].fader,
        "all",
        function (channel, control, value, status, group) {
            FerranMapping.volume.input(channel, control, value, status, group);
        }
    );
};