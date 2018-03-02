;(function (global) {

    var Mapping = function() {
    };

    Mapping.prototype = {

        map: function(channel, control, status, func) {
            
            if (typeof this[channel] === "undefined") {
                this[channel] = {};
            }
    
            if (status === null) {
                this[channel][control] = func;
            } else {
                if (typeof this[channel][control] === "undefined") {
                    this[channel][control] = {};
                }
                this[channel][control][status] = func;
            }
        },
    
        trigger: function(channel, control, value, status, group) {
    
            var statusNormalized = status - channel;
    
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
    exports.Mapping = Mapping;
    global.mapping = exports;

}(this));
