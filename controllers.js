;(function (global) {

    // Midi Fighter Spectra
    // ====================

    var Spectra = function() {

        this.midiChannel = 3;

        // Velocity value for led colors
        this.off = 0;
        this.red = 13;
        this.dimRed = 19;
        this.orange = 25;
        this.dimOrange = 31;
        this.yellow =  49;
        this.dimYellow = 62;
        this.green = 62;
        this.dimGreen = 67;
        this.teal = 73;
        this.dimTeal = 80;
        this.blue = 85;
        this.dimBlue = 96;
        this.purple = 100;
        this.dimPurple = 105;
        this.pink = 110;
        this.dimPink = 115;
        this.white = 126;

        // Create rows
        for (var i = 0; i < 4; ++i) {
            this[i] = {};
        }

        // Top left is (0,0)
        var control = 0x24;
        for (var i = 0; i < 16; ++i) {
            var row = 3 - Math.floor(i/4);
            var col = i%4;
            this[row][col] = control;
            ++control;
        }
    };

    // K1
    // ====================

    var K1 = function (channel) {
        this.midiChannel = channel;

        var Channel = function (i) {
            this.encoder = 0 + i
            this.encoderButton = 0x34 + i
            this.knob1 = 4 + i
            this.knob2 = 8 + i
            this.knob3 = 12 + i
            this.button1 = 0x30 + i
            this.button2 = 0x2C + i
            this.button3 = 0x28 + i
            this.fader = 16 + i
            this.button4 = 0x24 + i
            this.button5 = 0x20 + i
            this.button6 = 0x1C + i
            this.button7 = 0x18 + i
        };

        for (var i = 0; i < 4; ++i) {
            this[i] = new Channel(i);
        }
    }


    var exports = {};
    exports.spectra = new Spectra();
    exports.k1_1 = new K1(0);
    exports.k1_2 = new K1(1);
    global.controllers = exports;

}(this));
