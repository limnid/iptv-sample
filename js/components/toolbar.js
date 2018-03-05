var ToolbarComponent = BaseComponent.extend({
    ref: null,
    id: 11,
    items: [],

    init: function () {},

    setItems: function(items) {
        this.items = items;
    },

	didMount: function() {
        this.ref = document.createElement('div');
        this.ref.setAttribute('class', 'toolbar');
    },

	unMount: function() {
        this.ref = Dom.destroy(this.ref);
    },

	render: function() {
        var li = this.items.map(function (item, index) {
            return(
                '<li class="list__item">' +
                '<span><i class="'+item['ico']+' '+item['color']+'" aria-hidden="true"></i></span>' +
                '<span class="'+item['color']+'">'+item['name']+'</span>' +
                '</li>'
            );
        });

        Dom.render(this.ref, '<ul class="toolbar__list">'+li.join('')+'</ul>');
	}
});