"use strict";

/**
 * Init base components
 * */

var AppStore = new Store();
var Dom = new BaseDom();
var Route = new BaseRoute();

/**
 * Register event listener
 */

Events.addListener(EventTypes.KEY_DOWN, function(e) {
    AppStore.dispatch(EventTypes.KEY_DOWN, e);
});

/**
 * Global params
 */

AppStore.setWindowsSize(window.screen.width, window.screen.height);
AppStore.setBaseElements();
AppStore.setReferer();

/**
 * Add route
 */

Route.add('/watch', new WatchProvider());
Route.add('/info', new InfoProvider());
Route.add('/', new MainProvider());

/**
 * Run main route
 * */

Route.run('/');


