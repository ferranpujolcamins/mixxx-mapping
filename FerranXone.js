var Container = function() {
    this.volume = new components.Pot({
        group: "[Channel1]",
        key: "volume"
    });
};
Container.prototype = new components.ComponentContainer();



var XoneChain = {
};

XoneChain.cont = new Container();

XoneChain.apply = function() {
    XoneChain.cont.applyLayer({
        volume: {
            group: "[Channel2]"
        }
    }, false);
}

XoneChain.input = function (channel, control, value, status, group) {
    if (control == 0x10) {
        XoneChain.cont.volume.input(channel, control, value, status, group);
    } else if (control == 0x0C) {
        // Layer
        print("Layer");
        XoneChain.apply();
    } else if (control == 0x0F) {
        // Shift
        XoneChain.volumeProxy.triggerButton.input(channel, control, value, status, group);
    }
};
