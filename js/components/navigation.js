var NavigationComponent = BaseComponent.extend({
    ref: null,
	id: 1,
	items: [
        {name: "Главная", value: ""},
        {name: "Юмор", value: "humor"},
        {name: "Кино", value: "cinema"},
        {name: "TB", value: "tv"},
        {name: "Игры", value: "game"},
        {name: "Музыка", value: "music"},
        {name: "Авто", value: "avto"},
        {name: "Спорт", value: "sport"},
        {name: "Техно", value: "tech"},
        {name: "Обучение", value: "education"},
        {name: "Реклама", value: "adver"},
        {name: "Красота", value: "beauty"},
        {name: "Аниме", value: "anime"},
        {name: "Кулинария", value: "cook"},
        {name: "Новости", value: "news"},
        {name: "Искусство ", value: "arts"},
        {name: "Разное", value: "misc"}
    ],

    init: function() {},

    toggleNavigation: function() {
        if (AppStore.state().showNavigation === true) {
            AppStore.state().showNavigation = false;
            $(this.ref).fadeOut();
        } else {
            AppStore.state().showNavigation = true;
            $(this.ref).fadeIn();
        }
    },

    getSelectedItem: function() {
	    return this.items[AppStore.state().currentMenuItem];
    },

    hideNavigation: function() {
        AppStore.state().showNavigation = false;
        $(this.ref).fadeOut();
    },

	didMount: function()  {
		var _self = this;

        _self.ref = document.createElement('div');
        _self.ref.setAttribute('id', 'navigation-container');

        AppStore.subscribe(EventTypes.KEY_DOWN, function(e) {
			var code = e.keyCode | e.which;
			if (!AppStore.state().showNavigation) {
                return false;
            }
            switch(code) {
                case Keyboard.DOWN:
                    if (AppStore.state().currentMenuItem === _self.items.length - 1) return false;
                    AppStore.state().currentMenuItem = AppStore.state().currentMenuItem + 1;
                    return _self.render();
                case Keyboard.UP:
                    if (AppStore.state().currentMenuItem === 0) return false;
                    AppStore.state().currentMenuItem = AppStore.state().currentMenuItem - 1;
                    return _self.render();
            }
		}, this.id);
	},

	unMount: function() {
        AppStore.unsubscribe(EventTypes.KEY_DOWN, this.id);
        this.ref = Dom.destroy(this.ref);
	},

	render: function() {
        var li = this.items.map(function(item, index) {
            var className = 'navigation__item';
            if (index === AppStore.state().currentMenuItem) {
                className = 'navigation__item-active';
            }
            return ('<li data-index="'+ index +'" class="'+ className +'"><span>'+ item['name'] +'</span></li>')
        });
        var status = AppStore.state().showNavigation ? 'display: block;' : 'display: none;';
        this.ref.setAttribute('style', status);
        Dom.render(this.ref, '<div class="navigation"><ul class="navigation__list" >'+li.join('')+'</ul></div>');
	}
});