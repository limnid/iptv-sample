var MainProvider = BaseProvider.extend({
    id: 10,
    app: null,
    navigation: null,
    grid: null,
    toolbar: null,
    toolbarItems: [],

    init: function() {
        this.navigation = new NavigationComponent();
        this.grid = new GridComponent();
        this.toolbar = new ToolbarComponent();
        this.toolbarItems = [
            {name: 'List / F1', ico: 'fa fa-dot-circle-o', color: 'red'},
            {name: 'About / F3', ico: 'fa fa-dot-circle-o', color: 'yellow'},
            {name: 'Refresh / F2', ico: 'fa fa-dot-circle-o', color: 'green'},
            {name: 'Back', ico: 'fa fa-arrow-circle-o-left', color: 'white'},
            {name: 'Control', ico: 'fa fa-arrows', color: 'white'}
        ];
    },

    loadData: function() {
        AppStore.global().preloaderContainer.fadeIn();

        var _self = this;
        var category = AppStore.state().currentCategory ? AppStore.state().currentCategory.value : '';
        var request = $.ajax(Api.BASE + Api.ME, { dataType: "json" }),
            chained = request.then(function(data) {
                var payload = { time: data.time, ip: data.ip };
                var token = Utils.createJWT(Api.KEY, payload);
                return $.ajax(Api.BASE + Api.CATEGORIES + '/' + category + '?token='+token);
            });

        var categoryName = AppStore.state().currentCategory && AppStore.state().currentCategory.name.length > 0 ? " - " + AppStore.state().currentCategory.name : "";
        chained.fail(function(data){
            AppStore.global().errorContainer.show();
            AppStore.global().preloaderContainer.fadeOut();
        });
        chained.done(function(data) {
            var blocks = [],
                top = data['top'],
                recommended = data['recommended'],
                latest = data['latest'];

            blocks.push({'title': "Популярное" + categoryName, 'data': top});
            blocks.push({'title': "Рекомендованные ролики" + categoryName, 'data': recommended});
            blocks.push({'title': "Новое и интересное" + categoryName, 'data': latest});

            _self.grid.setItems(blocks);
            _self.grid.render();

            AppStore.global().preloaderContainer.fadeOut();
            AppStore.global().errorContainer.hide();
        });
    },

    before: function() {
        AppStore.global().mainContainer.fadeIn();
        AppStore.global().backgroundContainer.fadeIn();
    },

    attach: function() {
        var _self = this;

        _self.grid.didMount();

        _self.navigation.didMount();
        _self.navigation.render();

        _self.toolbar.didMount();
        _self.toolbar.setItems(_self.toolbarItems);
        _self.toolbar.render();

        _self.loadData();

        /**
         * Toolbar listener
         */

        AppStore.subscribe(EventTypes.KEY_DOWN, function(e) {
            var code = e.keyCode | e.which;

            switch(code) {
                case Keyboard.BACK:
                    return window.location = decodeURIComponent(AppStore.global().queryParams['referrer']);
                case Keyboard.RED:
                    return _self.navigation.toggleNavigation();
                case Keyboard.YELLOW:
                    _self.navigation.hideNavigation();
                    return Route.run('/info');
                case Keyboard.GREEN:
                    _self.navigation.hideNavigation();
                    return _self.loadData();
                case Keyboard.OK:
                    if (AppStore.state().showNavigation) {
                        AppStore.state().currentCategory = _self.navigation.getSelectedItem();
                        _self.navigation.hideNavigation();
                        return _self.loadData();
                    } else {
                        return Route.run('/watch');
                    }
                default:
                    if (AppStore.state().showNavigation && code === Keyboard.LEFT) {
                        return _self.navigation.hideNavigation();
                    } else if (AppStore.state().showNavigation && code === Keyboard.RIGHT) {
                        return _self.navigation.hideNavigation();
                    }
            }
        }, _self.id);

        this.app = document.createElement('div');
        this.app.setAttribute('class', 'App');
        this.app.appendChild(_self.toolbar.ref);
        this.app.appendChild(_self.navigation.ref);
        this.app.appendChild(_self.grid.ref);

        AppStore.global().mainContainer.html(this.app);
    },

    detach: function() {
        var _self = this;

        AppStore.unsubscribe(EventTypes.KEY_DOWN, _self.id);
        _self.grid.unMount();
        _self.navigation.unMount();
        _self.toolbar.unMount();

        AppStore.global().mainContainer.fadeOut();
        Dom.destroy(this.app);
    }
});