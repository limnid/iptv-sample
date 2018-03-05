/** 
 * Inheritance helper
 * For example Class.extend({ init: function() });
 */
var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
this.Class = function() {};
Class.extend = function(prop) {
    var _super = this.prototype; initializing = true;
    var prototype = new this(); initializing = false;

    for (var name in prop) {
        prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn) {
            return function() {
                var tmp = this._super;
                this._super = _super[name];
                var ret = fn.apply(this, arguments);        
                this._super = tmp;
                return ret;
            };
        })(name, prop[name]) : prop[name];
    }

    function Class() {
        if (!initializing && this.init) this.init.apply(this, arguments);
    }

    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
};

var Utils = {};

Utils.createJWT = function(secret, data) {
	// Defining our token parts
	var header = {
	  "alg": "HS256",
	  "typ": "JWT"
	};

	var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
	var encodedHeader = Utils.base64url(stringifiedHeader);

	var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
	var encodedData = Utils.base64url(stringifiedData);

	var signature = encodedHeader + "." + encodedData;
	signature = CryptoJS.HmacSHA256(signature, secret);
	signature = Utils.base64url(signature);

	return encodedHeader+'.'+encodedData+'.'+signature;
};

Utils.base64url = function(source) {
	// Encode in classical base64
	var encodedSource = CryptoJS.enc.Base64.stringify(source);

	// Remove padding equal characters
	encodedSource = encodedSource.replace(/=+$/, '');

	// Replace characters according to base64url specifications
	encodedSource = encodedSource.replace(/\+/g, '-');
	encodedSource = encodedSource.replace(/\//g, '_');

	return encodedSource;
};

Utils.decode = function(s) {
    return decodeURIComponent(s.split("+").join(" "));
};
	
var Events = {};

Events.addListener = function(name, listener) {
    return window.document.addEventListener(name, listener, false);
};

Events.dispatch = function(name) {
	var event = document.createEvent(name);
	event.initEvent(name, true, true);
    return window.document.dispatchEvent(event);
};

Events.dispatchCustom = function(name, detail) {
    window.document.dispatchEvent(new CustomEvent(name, {'detail': detail }));
};

var BaseRoute = Class.extend({
    rules: [],

    init: function() {},

    add: function(path, provider) {
        this.rules.push({
            path: path,
            provider: provider
        });
    },

    run: function(path) {
        var result = this.rules.filter(function(item, index) { return item.path === path; });
        var provider = result[0].provider;

        provider.before();
        provider.attach();

        this.rules.map(function(item, index) {
            if (item.path !== path) {
                item.provider.detach();
            }
        });
    }
});

var BaseProvider = Class.extend({
    init: function() {},
    before: function() {},
    attach: function() {},
    detach: function() {}
});

var BaseDom = Class.extend({
    init: function() {},

    render: function(node, content) {
        if (!node) return;

        var div = document.createElement('div');
        div.innerHTML = content;

        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }

        node.appendChild(div);

        return node;

        // var children = node.childNodes;
        // var newNodes = div.childNodes;
        /*for (var i = 0; i < newNodes.length; i++) {
            // node.insertBefore(newNodes[i], null);
            node.appendChild(newNodes[i]);
        }*/
    },

    purge: function purge(d) {
        var a = d.attributes, i, l, n;
        if (a) {
            for (i = a.length - 1; i >= 0; i -= 1) {
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                purge(d.childNodes[i]);
            }
        }
    },

    destroy: function (node) {
        if (!node) return;
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
        if (node.parentNode) {
            node.parentNode.replaceChild(node.cloneNode(true), node);
        }
        // node.innerHTML = "";
        node = null;
        return node;
    }
});

var BaseComponent = Class.extend({
    init: function() {},
    didMount: function() {},
    unMount: function() {},
    render: function() {}
});