var GridComponent = BaseComponent.extend({
	id: 2,
    ref: null,
    items: [],

    init: function() {},

	setItems: function(items) {
        this.items = items;
		this.render();
	},

	didMount: function() {
        var _self = this,
            hasUp = false,
            hasDown = false,
            hasNext = false,
            hasPrev = false;

        _self.ref = document.createElement('div');
        _self.ref.setAttribute('id', 'grid-container');
        _self.ref.setAttribute('class', 'container');

        AppStore.subscribe(EventTypes.KEY_DOWN, function(e) {
			var code = e.keyCode | e.which,
                cursorX = AppStore.state().cursorX,
                cursorY = AppStore.state().cursorY;

			// If navigation opened
            if (AppStore.state().showNavigation) {
                return false;
            }

            switch(code) {
                case Keyboard.RIGHT:
                    var maxRightSteps = cursorX === Config.MAX_RIGHT_STEP ? Config.MAX_RIGHT_STEP : AppStore.state().cursorX + 1;
                    AppStore.state().cursorX = maxRightSteps;
                    return AppStore.dispatch(EventTypes.NEXT);
                case Keyboard.LEFT:
                    var x = AppStore.state().cursorX > 0 ? AppStore.state().cursorX - 1 : 0;
                    AppStore.state().cursorX = x;
                    return AppStore.dispatch(EventTypes.PREV);
                case Keyboard.DOWN:
                    var maxDownSteps = cursorY === Config.MAX_DOWN_STEP ? Config.MAX_DOWN_STEP : AppStore.state().cursorY + 1;
                    AppStore.state().cursorY = maxDownSteps;
                    return AppStore.dispatch(EventTypes.DOWN);
                case Keyboard.UP:
                    var y = AppStore.state().cursorY > 0 ? AppStore.state().cursorY - 1 : 0;
                    AppStore.state().cursorY = y;
                    return AppStore.dispatch(EventTypes.UP);
            }
		}, this.id);

        AppStore.subscribe(EventTypes.UP, function(e) {
            if (hasUp) { _self.upElement(); }
        	hasUp = AppStore.state().cursorY === 0;
            hasDown = false;
            _self.render();
        }, this.id);

        AppStore.subscribe(EventTypes.DOWN, function(e) {
            if (hasDown) { _self.downElement(); }
        	hasDown = AppStore.state().cursorY === Config.MAX_DOWN_STEP;
            hasUp = false;
            _self.render();
        }, this.id);

        AppStore.subscribe(EventTypes.NEXT, function(e) {
            if (hasNext) { _self.nextElement(); }
            hasNext = AppStore.state().cursorX === Config.MAX_RIGHT_STEP;
            hasPrev = false;
            _self.render();
        }, this.id);

        AppStore.subscribe(EventTypes.PREV, function(e) {
            if (hasPrev) { _self.prevElement(); }
            hasPrev = AppStore.state().cursorX === 0;
            hasNext = false;
            _self.render();
        }, this.id);
	},

	upElement: function() {
        var firstElement = this.items.shift();
        this.items.push(firstElement);
    },

    downElement: function() {
        var lastElement = this.items.pop();
        this.items.unshift(lastElement);
    },

    nextElement: function() {
    	var list = this.items[AppStore.state().cursorY]['data'];
        var firstElement = list.shift();
        list.push(firstElement);
    },

    prevElement: function() {
    	var list = this.items[AppStore.state().cursorY]['data'];
        var lastElement = list.pop();
        list.unshift(lastElement);
    },

	unMount: function() {
        AppStore.unsubscribe(EventTypes.NEXT, this.id);
        AppStore.unsubscribe(EventTypes.PREV, this.id);
        AppStore.unsubscribe(EventTypes.DOWN, this.id);
        AppStore.unsubscribe(EventTypes.UP, this.id);
        AppStore.unsubscribe(EventTypes.KEY_DOWN, this.id);
        Dom.destroy(this.ref);
	},

	render: function() {
	    if (this.items.length <= 0) {
	        return;
        }
		var grid = this.items.map(function(griditem, gridindex) {
			if (gridindex > 2) {
				return;
			}

            var singleWidth = AppStore.global().clientWidth / 6,
                listWidth = singleWidth + (singleWidth / 2),
                style = ' style="width:'+listWidth+'px;"',
                gridClassName = 'movies__title';

			if (gridindex === AppStore.state().cursorY) {
				gridClassName = 'movies__title-active';
			}

			var items = griditem['data'].map(function(rowitem, rowindex) {
				if (rowindex > 4) {
					return;
				}
            	var rowClassName = 'listview__item';
        		if (AppStore.state().cursorX === rowindex && AppStore.state().cursorY === gridindex) {
                    AppStore.state().currentItem = rowitem;
        			rowClassName = 'listview__item-active';
        		}
            	return (
            		'<li id="'+rowitem['id']+'" class="'+ rowClassName +'"'+style+'>'+
	                    '<div class="listview__item_image"'+style+'>' +
	                         '<img src="'+rowitem['preview']+'" alt="" />' +
	                    '</div>' +
            			'<div class="listview__item_intro"'+style+'>' +
                    		'<div class="title-default">' +
                        		'<b>'+rowitem['title_formatted']+'</b>' +
                    		'</div>' +
            			'</div>' + 
            		'</li>'
        		);
            });

			return (
				'<div class="movies">' +
					'<div class='+ gridClassName +'>'+ griditem['title'] +'</div>' +
	                '<ul class="listview">'+ items.join('') + '</ul>' +
            	'</div>'
        	);
		});
		// document.getElementById('grid-container')
        Dom.render(this.ref, grid.join(''));
	}
});
