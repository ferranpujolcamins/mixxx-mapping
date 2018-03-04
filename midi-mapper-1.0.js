/**
 * MidiMapper JavaScript Library for Mixxx
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
     * How To Use
     * ==========
     * 
     * In you mapping xml file, assign MidiMapper.input to all the midi controls
     * and add <file filename="common-mapper.js"/> in the <scriptfiles> section.
     * 
     * In your JavaScript file, create a new mapper.MidiMapper();
     * In your script init function call the map function on your mapper
     * for each control you want to map.
     */
    var MidiMapper = function() {
    };

    MidiMapper.prototype = {

        /**
         * Maps a midi control to a JavaScript function
         * 
         * @param {Number} channel - An integer from 1 to 16 representing the midi channel of the control to map.
         * @param {Number} control - An integer from 0 to 127 representing the midi control to map.
         * @param {(Number|String)} status - An integer representing the midi status to map.
         *                                   The channel byte is ignored, so you can either pass 0x90 or 0x92,
         *                                   the channel that is mapped is the one described in channel parameter.
         *                                   Alternatively, you can pass a string to map the control for any status.
         * @param {function} func - A function that will be called when the mapped midi signal is recieved.
         *                          The function is passed the following parameters:
         *                          (channel, control, value, status, group)
         * 
         * @example <caption>Map control 20 of channel 2 for any midi status</caption>
         * mapper.map(2, 0x14, "all", myCallback);
         * 
         * @example <caption>Map noteOn of control 20 channel 2</caption>
         * mapper.map(2, 20, 0x90, myCallback);
         */
        map: function(channel, control, status, func) {

            if (typeof this[channel] === "undefined") {
                this[channel] = {};
            }
    
            if (typeof status === "string") {
                this[channel][control] = func;
            } else {
                var statusNormalized = status & 0xF0;
                if (typeof this[channel][control] === "undefined") {
                    this[channel][control] = {};
                }
                this[channel][control][statusNormalized] = func;
            }
        },
    
        input: function(channel, control, value, status, group) {

            var statusNormalized = status & 0xF0;
    
            // If control not mapped do nothing
            if (this[channel] == undefined) {
                return;
            }

            var controlFuncOrObject = this[channel][control];

            if (typeof controlFuncOrObject === "function") {

                controlFuncOrObject(channel, control, value, status, group);

            } else if (typeof controlFuncOrObject === "object") {

                var statusFunc = controlFuncOrObject[statusNormalized];
                if (typeof statusFunc === "function") {
                    statusFunc(channel, control, value, status, group);
                }
            }
        }
    };

    var exports = {};
    exports.MidiMapper = MidiMapper;
    global.mapper = exports;

}(this));
