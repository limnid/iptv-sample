var WatchProvider = BaseProvider.extend({
    id: 5,
    watch: null,
    app: null,

    init: function() {
        var _self = this;
        _self.watch = new WatchComponent();
    },

    before: function() {
        AppStore.global().watchContainer.fadeIn();
    },

    attach: function() {
        var _self = this;

        AppStore.global().backgroundContainer.fadeIn();
        AppStore.global().preloaderContainer.fadeIn();

        _self.watch.didMount();
        _self.watch.setItem(AppStore.state().currentItem);
        _self.watch.render();

        var name_encoded = AppStore.state().currentItem.name_encoded;
        var request = $.ajax(Api.BASE + Api.ME, { dataType: "json" }),
            chained = request.then(function(data) {
                var payload = { time: data.time, ip: data.ip };
                var token = Utils.createJWT(Api.KEY, payload);
                return $.ajax(Api.BASE + Api.VIDEO + '/' + name_encoded + '?token='+token);
            });

        chained.fail(function(data){
            AppStore.global().errorContainer.show();
            AppStore.global().preloaderContainer.fadeOut();
            _self.watch.showPanel();
        });

        chained.done(function(data) {
            var video = data['video'];
            AppStore.dispatch('playVideo', video.video);
            _self.watch.setItem(video);
            _self.watch.hidePanel();
            AppStore.global().errorContainer.hide();
        });

        AppStore.subscribe(EventTypes.KEY_DOWN, function(e) {
            var code = e.keyCode | e.which;
            switch(code) {
                case Keyboard.LEFT:
                    AppStore.dispatch(EventTypes.PAUSE);
                    AppStore.dispatch(EventTypes.STOP);
                    return Route.run('/');
                case Keyboard.BACK:
                    AppStore.dispatch(EventTypes.PAUSE);
                    AppStore.dispatch(EventTypes.STOP);
                    return Route.run('/');
                case Keyboard.EXIT:
                    AppStore.dispatch(EventTypes.PAUSE);
                    AppStore.dispatch(EventTypes.STOP);
                    return Route.run('/');
            }
        }, _self.id);

        AppStore.subscribe(EventTypes.STB_EVENT, function(data) {
            if (data === StbEvent.START || data === StbEvent.VIDEO_INFO) {
                AppStore.global().backgroundContainer.fadeOut();
                AppStore.global().preloaderContainer.fadeOut();
            } else if (data === StbEvent.END) {
                Route.run('/');
            }
        });

        this.app = document.createElement('div');
        this.app.setAttribute('id', 'watch');
        this.app.appendChild(_self.watch.ref);
        AppStore.global().watchContainer.html(this.app);
    },

    detach: function() {
        var _self = this;
        AppStore.unsubscribe(EventTypes.KEY_DOWN, _self.id);
        AppStore.global().watchContainer.fadeOut();
        AppStore.global().watchContainer.html("");
        _self.watch.unMount();
        Dom.destroy(this.app);
    }
});