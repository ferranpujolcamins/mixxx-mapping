;(function (global) {

    // Midi Fighter Spectra
    // ====================

    var Spectra = function() {

        this.channel = 3;

        // Velocity value for led colors
        this.a = 61;
        this.b = 67;

        this.off = 0;
        this.red = 13;
        this.dimRed = 19;
        this.orange = 25;
        this.dimOrange = 31;
        this.yellow =  49;
        this.dimYellow = 55;
        this.green = 60;
        this.dimGreen = 67;

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


    var exports = {};
    exports.spectra = new Spectra();
    global.controllers = exports;

}(this));