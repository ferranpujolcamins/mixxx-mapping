var FerranMapping = {
};

// Midi Fighter Twister
    // ====================

var Twister = function () {
    this.encodersChannel = 0;
    this.buttonsChannel = 1;

    for (let row = 0; row < 4; ++row) {
        this[row] = {};
        for (let column = 0; column < 4; ++column) {
            let cc = row * 4 + column;
            this[row][column] = {
                button: new Button(),
                encoder: new TwisterEncoder({
                    midi: [0xB0 + this.encodersChannel, cc]
                })
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
        // TODO: take into account min and max values of the control
        console.log(this.inGetParameter() + (value - 64) * this.resolution);
        return this.inGetParameter() + (value - 64) * this.resolution;
    }
});

FerranMapping.init = function () {
    this.deck = {};
    for (var i = 0; i < 4; ++i) {
        this.deck[i] = new Deck(i + 1);
    }

    this.twister = new Twister();
    this.twister[0][0].encoder.group = "[Channel1]";
    this.twister[0][0].encoder.inKey = "volume";
};

FerranMapping.input = function (channel, control, value, status, group) {
    this.twister.input(channel, control, value, status, group);
};