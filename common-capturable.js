/**
 * Sequencer JavaScript Library for Mixxx
 * Version 1.0
 *
 * Copyright (C) 2017 Ferran Pujol Camins
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

;(function (global) {

    /**
     *
     * @param {Object} properties
     * @param {String|Number} properties.id
     * @constructor
     */
    var CapturableButton = function(properties) {

        components.Button.call(this, properties);

        // TODO: move this
        var self = this;
        var initialBlinkInterval = 75;
        this.animation = new sequencer.Sequencer({
            steps: [
                [0,(function () {self.output(self.animation.newState);})],
                [initialBlinkInterval,(function () {self.output(self.animation.currentState);})],
                [initialBlinkInterval,(function () {self.output(self.animation.newState);})],
                [initialBlinkInterval,(function () {self.output(self.animation.currentState);})],
                [initialBlinkInterval,(function () {self.output(self.animation.newState);})],
                [initialBlinkInterval,(function () {self.output(self.animation.currentState);})],
                [initialBlinkInterval,(function () {self.output(self.animation.newState);})],
                [initialBlinkInterval,(function () {self.output(self.animation.currentState);})],
                [initialBlinkInterval,(function () {self.output(self.animation.newState);})],

                [925,(function () {self.output(self.animation.currentState);})],
                [25,(function () {self.output(self.animation.newState);})],
                [25,(function () {self.output(self.animation.currentState);})],
                [25,(function () {self.output(self.animation.newState);})],
            ],
            loop: 9
        });
    };

    CapturableButton.prototype = _.create(components.Button.prototype, {

        constructor: CapturableButton,

        getCurrentState: function() {
            return this.inGetValue() > 0;
        },

        // returns next state
        getNextState: function(prevState, midiMessage) {
            return 1 - prevState;
        },

        applyState: function(state) {
            this.inSetValue(state);
        },

        outputState: function (state) {
            this.animation.stop();
            this.output(state);
        },

        // TODO: we should not assume that an animation is wanted here. subclasses should decide that, so they can change animation according to state too
        outputStatePreview: function (currentState, newState) {
            this.animation.currentState = currentState;
            this.animation.newState = newState;
            this.animation.start();
        }

        // input: function (channel, control, value, status, group) {
        //     if (this.activeShiftButton !== null) {
        //         this.captureMessage(this, channel, control, value, status, group);
        //     } else {
        //         componentInput.call(this, channel, control, value, status, group);
        //     }
        // }

    });



    var exports = {};
    exports.CapturableButton = CapturableButton;
    global.capturable = exports;

}(this));
