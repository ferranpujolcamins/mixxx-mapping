;(function (global) {

    // Midi Fighter Spectra
    // ====================

    var Spectra = function() {

        this.channel = 3;

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

    // Xone K1
    // =======
    var KStrip = function (number) {
        var buttons = [
            "bottomButton4",
            "bottomButton3",
            "bottomButton2",
            "bottomButton1",
            "topButton3",
            "topButton2",
            "topButton1",
            "encoderButton"
        ];
        var noteNumber = 24 + number;
        for (var button in buttons) {
            this[button] = noteNumber;
            noteNumber += 4;
        }
        this.encoder = number;
        this.fader = 16 + number;
        this.topKnob = 4 + number;
        this.middleKnob = 8 + number;
        this.bottomKnob = 12 + number;
    }

    var K1 = function () {
        this.channel = 0;
        for (var i = 0; i < 4; ++i) {
            this[i] = new KStrip(i);
        }

        this.leftButton = 12;
        this.rightButton = 15;
        this.leftEncoderButton = 13;
        this.rightEncoderButton = 14;
        this.leftEncoder = 20;
        this.rightEncoder = 21;
    }

    var exports = {};
    exports.spectra = new Spectra();
    exports.k1 = new K1();
    global.controllers = exports;

}(this));