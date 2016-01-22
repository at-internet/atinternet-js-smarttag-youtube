var Tag = function () {
    var _this = this;
    _this.addObject = {};
    _this.sendObject = {};
    _this.richMedia = {
        add: function (obj) {
            _this.addObject = obj;
        },
        send: function (obj) {
            _this.sendObject = obj;
        }
    };
    _this.youTube = {};
};
ATInternet = {
    Tracker: {
        Plugins: {},
        Tag: Tag,
        addPlugin: function () {}
    }
};
YT = {
    PlayerState: {
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3
    }
};

