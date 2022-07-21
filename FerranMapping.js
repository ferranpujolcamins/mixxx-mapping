var FerranMapping = {
};

// Midi Fighter Twister
// ====================

// options is a matrix of {button:, encoder:} options
var TwisterOptions = function () {
    for (let i = 0; i < 4; ++i) {
        this[i] = {};
        for (let j = 0; j < 4; ++j) {
            this[i][j] = { encoder: {}, button: {} };
        }
    }
}

var Twister = function (options) {
    this.encodersChannel = 0;
    this.buttonsChannel = 1;
    for (let row = 0; row < 4; ++row) {
        this[row] = {};
        for (let column = 0; column < 4; ++column) {
            let cc = row * 4 + column;
            this[row][column] = {
                button: new Button(options[row][column].button),
                encoder: new TwisterEncoder(
                    _.assign(options[row][column].encoder,
                        { midi: [0xB0 + this.encodersChannel, cc] })
                )
            };
        }
    }
}

Twister.prototype = new components.ComponentContainer({
    input: function (channel, control, value, status, group) {
        let row = Math.floor(control / 4);
        let column = control % 4;
        if (row < 0 || row > 3 || column < 0 || column > 3) {
            return;
        }

        if (status == 0xB0 + this.encodersChannel) {
            this[row][column]
                .encoder
                .input(channel, control, value, status, group);
        } else if (status == 0x90 + this.buttonsChannel || status == 0x80 + this.buttonsChannel) {
            // TODO: can't we just use status on the if condition?
            this[row][column]
                .button
                .input(channel, control, value, status, group);
        }
    }
});

const TwisterEncoder = function (options) {
    this.resolution = 0.01;
    components.Component.call(this, options);
};

TwisterEncoder.prototype = new components.Component({
    inValueScale: function (value) {
        return this.inGetParameter() + (value - 64) * this.resolution;
    },
    outValueScale: function (value) {
        return value * this.max;
    }
});

FerranMapping.init = function () {
    this.deck = {};
    for (var i = 0; i < 4; ++i) {
        this.deck[i] = new Deck(i + 1);
    }

    var options = new TwisterOptions();
    options[0][0].encoder.group = "[Channel1]";
    options[0][0].encoder.key = "volume";

    this.twister = new Twister(options);
};

FerranMapping.input = function (channel, control, value, status, group) {
    this.twister.input(channel, control, value, status, group);
};