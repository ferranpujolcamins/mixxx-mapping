;(function (global) {

    var status = {

        noteOn: 0x90,
        on: 0x90,

        noteOff: 0x80,
        off: 0x80,

        keyPressure: 0xA0,
        kp: 0xA0,

        controlChange: 0xB0,
        cc: 0xB0,

    };


    var exports = {};
    exports.status = status;
    global.midi = exports;

}(this));
