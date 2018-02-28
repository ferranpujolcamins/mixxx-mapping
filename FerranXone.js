var ComponentProxy = function(options) {
    this.component = {};
    _.assign(this, options);
};

ComponentProxy.prototype = {
    input: function (channel, control, value, status, group) {
        this.output(channel, control, value, status, group);
    },
    output: function (channel, control, value, status, group) {
        this.component.input(channel, control, value, status, group);
    }
};

var HoldingProxy = function(options) {
    // USE COMPONENT CONTAINER INSTEAD?
    // Fer el proxy a nivell funcional, separar midi de funcio
    var self = this;
    this.captureButton = new components.Button({
        type: components.Button.prototype.types.toggle,
        inGetValue: function () {
            return self.capturing;
        },
        inSetValue: function (value) {
            self.capturing = value;
        },
    });
    this.triggerButton = new components.Button({
        type: components.Button.prototype.types.push,
        inGetValue: function () {
            return self.trigger;
        },
        inSetValue: function (value) {
            print(value);
            if (value) {
                self.trigger();
            }
        },
    });
    this.capturing = false;
    this.capturedMessage = null;
    ComponentProxy.call(this, options);
};

HoldingProxy.prototype = new ComponentProxy({
    trigger: function() {
        print("trigger " + this.capturing + " " + this.capturedMessage);
        if (this.capturing == false && this.capturedMessage !== null) {
            this.output(this.capturedMessage[0], this.capturedMessage[1], this.capturedMessage[2], this.capturedMessage[3], this.capturedMessage[4]);
            this.capturedMessage = null;
        }
    },
    capture: function(message) {
        this.capturedMessage = message;
    },
    shouldCaptureMessage: function(message) {
        return true;
    },
    input: function (channel, control, value, status, group) {
        var message = [channel, control, value, status, group];
        print("Capturing" + this.capturing);
        if (this.capturing == true && this.shouldCaptureMessage(message)) {
            this.capture(message)
        } else {
            this.output(channel, control, value, status, group);
        }
    }
});


var XoneChain = {};

XoneChain.input = function (channel, control, value, status, group) {
    if (control == 0x10) {
        XoneChain.volumeProxy.input(channel, control, value, status, group);
    } else if (control == 0x0C) {
        // Layer
        print("Layer");
        XoneChain.volumeProxy.captureButton.input(channel, control, value, status, group);
    } else if (control ==0x0F) {
        // Shift
        XoneChain.volumeProxy.triggerButton.input(channel, control, value, status, group);
    }
};

XoneChain.volumeProxy = new HoldingProxy({
    component: new components.Pot({
        group: '[Channel1]',
        inKey: 'volume',
    }),
});
