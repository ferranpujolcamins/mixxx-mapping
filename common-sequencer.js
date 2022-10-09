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
     * @param {Array} properties.steps
     * @param {bool] properties.loop
     * @constructor
     */
    var Sequencer = function(properties) {

        _.assign(this, properties);
        // if (this.loop !== true) {
        //     this.loop = false;
        // }

        this.stepIndex = 0;
        this.timer = null;
    };

    Sequencer.prototype = {

        // TODO: right now this does not respect the timings...
        start: function () {
            this.stepIndex = 0;
            this.executeStep();
        },

        stop: function () {
            if (this.timer !== null) {
                engine.stopTimer(this.timer);
                this.timer = null;
            }
        },

        // executeStep: function () {
        //     var self = this;
        //     if (self.timer === null) {
        //         if (self.stepIndex < self.steps.length) {
        //             var currentStep = self.steps[self.stepIndex];
        //             engine.beginTimer(currentStep[0], function () {
        //                 currentStep[1](self.stepIndex);
        //                 self.stepIndex += 1;
        //                 self.timer = null;
        //                 self.executeStep();
        //             }, true);
        //         } else if (this.loop) {
        //             self.start();
        //         }
        //     }
        // },

        executeStep: function() {

            if (this.stepIndex < this.steps.length) {
                if (this.timer !== null) {
                    this.stop();
                }
                var currentStep = this.steps[this.stepIndex];
                this.timer = engine.beginTimer(currentStep[0], function () {
                    currentStep[1](this.stepIndex);
                    this.stepIndex += 1;
                    this.timer = null;
                    this.executeStep();
                }.bind(this), true);
            } else {
                // TODO: this check agasint false is wrong, loop is int
                if (this.loop !== false) {
                    this.stepIndex = this.loop;
                    this.executeStep();
                }
            }
        }
    }



    var exports = {};
    exports.Sequencer = Sequencer;
    global.sequencer = exports;

}(this));
