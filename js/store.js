/**
 * Global app state
 * */
function Store() {
    this.handlers = [];
    this.stateData = {
        cursorX: 0,
        cursorY: 0,
        showNavigation: false,
        currentItem: null,
        currentMenuItem: 0,
        currentCategory: null,
        mainItems: []
    };
    this.globalData = {
        clientWidth: 0,
        clientHeight: 0,
        mainContainer: null,
        backgroundContainer: null,
        errorContainer: null,
        infoContainer: null,
        preloaderContainer: null,
        watchContainer: null,
        queryParams: {}
    };
}

Store.prototype.setWindowsSize = function(width, height) {
    this.globalData.clientWidth = width;
    this.globalData.clientHeight = height;
};

Store.prototype.setBaseElements = function() {
    this.globalData.mainContainer = $('#Main-Page');
    this.globalData.backgroundContainer = $('#background');
    this.globalData.errorContainer = $('#error');
    this.globalData.preloaderContainer = $('#preloader');
    this.globalData.watchContainer = $('#Watch-Page');
    this.globalData.infoContainer = $('#Info-Page');
    $('.background-default').css({'width': this.globalData.clientWidth,'height': this.globalData.clientHeight});
};

Store.prototype.setReferer = function() {
    if (this.globalData.queryParams['referrer']) {
        return;
    }
    var $_GET = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function() {
        $_GET[Utils.decode(arguments[1])] = Utils.decode(arguments[2]);
    });
    this.globalData.queryParams = $_GET;
};

Store.prototype.subscribe = function(name, fn, uniqueKey) {
    uniqueKey = typeof uniqueKey !== 'undefined' ? uniqueKey : 0;
    var found = this.handlers.filter(function(item) {
        if (item.name === name && item.uniqueKey === uniqueKey) {
            return item;
        }
    });
    if (found.length <= 0) {
        this.handlers.push({name: name, fn: fn, uniqueKey: uniqueKey});
    }
};

Store.prototype.global = function() {
    return this.globalData;
};

Store.prototype.state = function() {
    return this.stateData;
};

Store.prototype.unsubscribe = function(name, uniqueKey) {
    uniqueKey = typeof uniqueKey !== 'undefined' ? uniqueKey : 0;
    this.handlers = this.handlers.filter(function(item) {
        if (!(item.name === name && item.uniqueKey === uniqueKey)) {
            return item;
        }
    });
};

Store.prototype.dispatch = function(name, data, objScope) {
    data = typeof data !== 'undefined' ? data : false;
    var scope = objScope || window;
    this.handlers.map(function(item) {
        if (item.name === name) {
            item.fn(data);
        }
    });
};