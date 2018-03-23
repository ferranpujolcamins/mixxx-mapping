;(function (global) {
    _.create = function(a, b) {
        var temp = Object.create(a);
        _.assign(temp, b);
        return temp;
    }
}(this));