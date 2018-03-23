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

    var MidiMessage = function(channel, control, value, status, group) {
        this.channel = channel;
        this.control = control;
        this.value = value;
        this.status = status;
        this.group = group;
    }

    var exports = {};
    exports.MidiMessage = MidiMessage;
    global.midimessage = exports;

}(this));