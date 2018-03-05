var WatchComponent = BaseComponent.extend({
    ref: null,
	id: 7,
	state: {},

    init: function() {},

	fadeOutPanel: function() {
    	var _self = this;
        clearTimeout(this.state.actionPanelTimeOut);
        this.state.fadeInPanel = true;
        this.state.actionPanelTimeOut = setTimeout(function() {
            if (!_self.state.pause) {
                _self.state.fadeInPanel = false;
                _self.render();
            }
            clearTimeout(_self.state.actionPanelTimeOut);
        }, 2000);
    },

    hidePanel: function() {
        var _self = this;
        this.state.fadeInPanel = false;
        _self.render();
    },

    showPanel: function() {
        var _self = this;
        this.state.fadeInPanel = true;
        _self.render();
    },

    setItem: function(video) {
        this.state.duration = video.duration;
        this.state.title = video.title;
    },

	didMount: function() {
		var _self = this;

		_self.state = {
            actionPanelTimeOut: 0,
            fadeInBackground: true,
            fadeInPreloader: true,
            pause: false,
            fadeInPanel: true,
            duration: "00:00",
            title: "",
            detail: ""
        };

        _self.ref = document.createElement('div');
        _self.ref.setAttribute('id', 'watch');

        AppStore.subscribe(EventTypes.KEY_DOWN, function(e) {
			var code = e.keyCode | e.which;
			_self.fadeOutPanel();
            switch(code) {
                case Keyboard.OK:
                    if (_self.state.pause) {
                        _self.state.pause = false;
             			_self.render();
                        return AppStore.dispatch(EventTypes.CONTINUE);
                    } else {
                        _self.state.pause = true;
                        _self.render();
                        return AppStore.dispatch(EventTypes.PAUSE);
                    }
            }
		}, this.id);
	},

	unMount: function() {
        AppStore.unsubscribe(EventTypes.KEY_DOWN, this.id);
        this.ref = Dom.destroy(this.ref);
	},

	render: function() {
		var status = (this.state.pause) ? "fa fa-play" : "fa fa-pause";
		var panel = "";

		if (this.state.fadeInPanel) {
			panel = 
                '<div class="info__panel">' +
                    '<div class="title">' +
                        this.state.title +
                    '</div>' +
                '</div>' +
                '<div class="video__navigation">' +
                    '<div class="action__panel">' +
                        '<div class="action action-small">' +
                            '<span><i class="fa fa-clock-o" aria-hidden="true"></i></span>' +
                            '<span>'+ this.state.duration +'</span>' +
                        '</div>' +
                        '<div class="action">' +
                            '<span><i class="'+ status +'" aria-hidden="true"></i></span>' +
                        '</div>' +
                        '<div class="action action-small">' +
                            '<span><i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i></span>' +
                            '<span>назад</span>' +
                            '<span>'+ this.state.detail +'</span>' +
                        '</div>' +
                    '</div>' +
                '</div>';
		}

        Dom.render(this.ref, panel);
	}
});