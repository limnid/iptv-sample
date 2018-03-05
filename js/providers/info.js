var InfoProvider = BaseProvider.extend({
    id: 9,
    app: null,
    toolbar: null,
    toolbarItems: [],

    init: function() {
        this.toolbar = new ToolbarComponent();
        this.toolbarItems = [
            {name: 'Назад', ico: 'fa fa-arrow-circle-o-left', color: 'white'}
        ];
    },

    before: function() {
        AppStore.global().infoContainer.fadeIn();
        AppStore.global().backgroundContainer.fadeIn();
    },

    attach: function() {
        var _self = this;

        _self.toolbar.didMount();
        _self.toolbar.setItems(_self.toolbarItems);
        _self.toolbar.render();

        AppStore.subscribe(EventTypes.KEY_DOWN, function(e) {
            var code = e.keyCode | e.which;
            switch(code) {
                case Keyboard.BACK:
                    return Route.run('/');
                case Keyboard.EXIT:
                    return Route.run('/');
                case Keyboard.LEFT:
                    return Route.run('/');
            }
        }, _self.id);

        var text = document.createElement('div');
        text.setAttribute('id', 'info-container');
        text.setAttribute('class', 'container');
        text.innerHTML =
            '<h1>О приложении</h1>'+
            '<p>'+
                'Официальное приложение Mover.uz для IPTV-приставки позволяет смотреть ' +
                'видеоролики с популярного видеохостинга прямо на вашем телевизоре.'+
            '</p>'+
            '<p>'+
                'На Mover.uz всегда и ежедневно вы найдете много популярных видероликов:'+
                '<ul>'+
                    '<li>- интересное видео</li>'+
                    '<li>- смешные приколы</li>'+
                    '<li>- смешные приколы</li>'+
                    '<li>- трендовые ТВ-передачи</li>'+
                    '<li>- новые клипы</li>'+
                    '<li>- прохождения игр</li>'+
                    '<li>- трейлеры к фильмам</li>'+
                    '<li>- футбольные обзоры и многое другое</li>'+
                '</ul>'+
            '</p>'+
            '<p>Сайт находится в зоне Tas-IX.</p>';

        this.app = document.createElement('div');
        this.app.setAttribute('id', 'watch');
        this.app.appendChild(_self.toolbar.ref);
        this.app.appendChild(text);
        AppStore.global().infoContainer.html(this.app);
    },

    detach: function() {
        var _self = this;
        AppStore.unsubscribe(EventTypes.KEY_DOWN, _self.id);
        AppStore.global().infoContainer.fadeOut();
        AppStore.global().infoContainer.html("");
        Dom.destroy(this.app);
    }
});