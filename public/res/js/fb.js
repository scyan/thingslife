/**
 * Prelude.
 * 
 * Namespaces are one honking great idea -- let's do more of those! -- Tim
 * Peters
 * 
 * The Prelude is what keeps us from being messy. In order to co-exist with
 * arbitary environments, we need to control our footprint. The one and only
 * rule to follow here is that we need to limit the globals we introduce. The
 * only global we should every have is ``FB``. This is exactly what the prelude
 * enables us to do.
 * 
 * The main method to take away from this file is `FB.copy()`_. As the name
 * suggests it copies things. Its powerful -- but to get started you only need
 * to know that this is what you use when you are augmenting the FB object. For
 * example, this is skeleton for how ``FB.Event`` is defined::
 * 
 * FB.provide('Event', { subscribe: function() { ... }, unsubscribe: function() {
 * ... }, fire: function() { ... } });
 * 
 * This is similar to saying::
 * 
 * FB.Event = { subscribe: function() { ... }, unsubscribe: function() { ... },
 * fire: function() { ... } };
 * 
 * Except it does some housekeeping, prevents redefinition by default and other
 * goodness. .. _FB.copy(): #method_FB.copy
 * 
 * @class FB
 * @static
 * @access private
 */
if (!window.FB) {
	FB = {
		_logging : true,

		/**
		 * Copies things from source into target.
		 * 
		 * @access private
		 * @param target
		 *            {Object} the target object where things will be copied
		 *            into
		 * @param source
		 *            {Object} the source object where things will be copied
		 *            from
		 * @param overwrite
		 *            {Boolean} indicate if existing items should be overwritten
		 * @param tranform
		 *            {function} [Optional], transformation function for each
		 *            item
		 */
		copy : function(target, source, overwrite, transform) {
			for ( var key in source) {
				if (overwrite || typeof target[key] === 'undefined') {
					target[key] = transform ? transform(source[key]) : source[key];
				}
			}
			return target;
		},

		/**
		 * Create a namespaced object.
		 * 
		 * @access private
		 * @param name
		 *            {String} full qualified name ('Util.foo', etc.)
		 * @param value
		 *            {Object} value to set. Default value is {}. [Optional]
		 * @return {Object} The created object
		 */
		create : function(name, value) {
			var node = window.FB, // We will use 'FB' as root namespace
			nameParts = name ? name.split('.') : [], c = nameParts.length;
			for ( var i = 0; i < c; i++) {
				var part = nameParts[i];
				var nso = node[part];
				if (!nso) {
					nso = (value && i + 1 == c) ? value : {};
					node[part] = nso;
				}
				node = nso;
			}
			return node;
		},

		/**
		 * Copy stuff from one object to the specified namespace that is FB.<target>.
		 * If the namespace target doesn't exist, it will be created
		 * automatically.
		 * 
		 * @access private
		 * @param target
		 *            {Object|String} the target object to copy into
		 * @param source
		 *            {Object} the source object to copy from
		 * @param overwrite
		 *            {Boolean} indicate if we should overwrite
		 * @return {Object} the *same* target object back
		 */
		provide : function(target, source, overwrite) {
			// a string means a dot separated object that gets appended to, or
			// created
			return FB.copy(typeof target == 'string' ? FB.create(target) : target, source, overwrite);
		},

		/**
		 * Generates a weak random ID.
		 * 
		 * @access private
		 * @return {String} a random ID
		 */
		guid : function() {
			return 'f' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
		},

		/**
		 * Logs a message for the developer if logging is on.
		 * 
		 * @access private
		 * @param args
		 *            {Object} the thing to log
		 */
		log : function(args) {
			if (FB._logging) {
				// TODO what is window.Debug, and should it instead be relying
				// on the
				// event fired below?
				// #JSCOVERAGE_IF 0
				if (window.Debug && window.Debug.writeln) {
					window.Debug.writeln(args);
				} else if (window.console) {
					window.console.log(args);
				}
				// #JSCOVERAGE_ENDIF
			}

			// fire an event if the event system is available
			if (FB.Event) {
				FB.Event.fire('fb.log', args);
			}
		},

		/**
		 * Shortcut for document.getElementById
		 * 
		 * @method $
		 * @param {string}
		 *            DOM id
		 * @return DOMElement
		 * @access private
		 */
		$ : function(id) {
			return document.getElementById(id);
		}
	};
};

/**
 * Array related helper methods.
 * 
 * @class FB.Array
 * @private
 * @static
 */
FB.provide('Array', {
	/**
	 * Get index of item inside an array. Return's -1 if element is not found.
	 * 
	 * @param arr
	 *            {Array} Array to look through.
	 * @param item
	 *            {Object} Item to locate.
	 * @return {Number} Index of item.
	 */
	indexOf : function(arr, item) {
		if (arr.indexOf) {
			return arr.indexOf(item);
		}
		var length = arr.length;
		if (length) {
			for ( var index = 0; index < length; index++) {
				if (arr[index] === item) {
					return index;
				}
			}
		}
		return -1;
	},

	/**
	 * Merge items from source into target, but only if they dont exist. Returns
	 * the target array back.
	 * 
	 * @param target
	 *            {Array} Target array.
	 * @param source
	 *            {Array} Source array.
	 * @return {Array} Merged array.
	 */
	merge : function(target, source) {
		for ( var i = 0; i < source.length; i++) {
			if (FB.Array.indexOf(target, source[i]) < 0) {
				target.push(source[i]);
			}
		}
		return target;
	},

	/**
	 * Create an new array from the given array and a filter function.
	 * 
	 * @param arr
	 *            {Array} Source array.
	 * @param fn
	 *            {Function} Filter callback function.
	 * @return {Array} Filtered array.
	 */
	filter : function(arr, fn) {
		var b = [];
		for ( var i = 0; i < arr.length; i++) {
			if (fn(arr[i])) {
				b.push(arr[i]);
			}
		}
		return b;
	},

	/**
	 * Create an array from the keys in an object.
	 * 
	 * Example: keys({'x': 2, 'y': 3'}) returns ['x', 'y']
	 * 
	 * @param obj
	 *            {Object} Source object.
	 * @param proto
	 *            {Boolean} Specify true to include inherited properties.
	 * @return {Array} The array of keys.
	 */
	keys : function(obj, proto) {
		var arr = [];
		for ( var key in obj) {
			if (proto || obj.hasOwnProperty(key)) {
				arr.push(key);
			}
		}
		return arr;
	},

	/**
	 * Create an array by performing transformation on the items in a source
	 * array.
	 * 
	 * @param arr
	 *            {Array} Source array.
	 * @param transform
	 *            {Function} Transformation function.
	 * @return {Array} The transformed array.
	 */
	map : function(arr, transform) {
		var ret = [];
		for ( var i = 0; i < arr.length; i++) {
			ret.push(transform(arr[i]));
		}
		return ret;
	},

	/**
	 * For looping through Arrays and Objects.
	 * 
	 * @param {Object}
	 *            item an Array or an Object
	 * @param {Function}
	 *            fn the callback function for iteration. The function will be
	 *            pass (value, [index/key], item) paramters
	 * @param {Bool}
	 *            proto indicate if properties from the prototype should be
	 *            included
	 * 
	 */
	forEach : function(item, fn, proto) {
		if (!item) {
			return;
		}

		if (Object.prototype.toString.apply(item) === '[object Array]' || (!(item instanceof Function) && typeof item.length == 'number')) {
			if (item.forEach) {
				item.forEach(fn);
			} else {
				for ( var i = 0, l = item.length; i < l; i++) {
					fn(item[i], i, item);
				}
			}
		} else {
			for ( var key in item) {
				if (proto || item.hasOwnProperty(key)) {
					fn(item[key], key, item);
				}
			}
		}
	}
});

/**
 * Event handling mechanism for globally named events.
 *
 * @static
 * @class FB.Event
 */
FB.provide('EventProvider', {
	/**
	 * Returns the internal subscriber array that can be directly manipulated by
	 * adding/removing things.
	 *
	 * @access private
	 * @return {Object}
	 */
	subscribers : function() {
		// this odd looking logic is to allow instances to lazily have a map of
		// their events. if subscribers were an object literal itself, we would
		// have issues with instances sharing the subscribers when its being used
		// in a mixin style.
		if (!this._subscribersMap) {
			this._subscribersMap = {};
		}
		return this._subscribersMap;
	},

	/**
	 * Subscribe to a given event name, invoking your callback function whenever
	 * the event is fired.
	 *
	 * For example, suppose you want to get notified whenever the session
	 * changes:
	 *
	 *     FB.Event.subscribe('auth.sessionChange', function(response) {
	 *       // do something with response.session
	 *     });
	 *
	 * Global Events:
	 * - fb.log -- fired on log message
	 *
	 * @access public
	 * @param name {String} Name of the event.
	 * @param cb {Function} The handler function.
	 */
	subscribe : function(name, cb) {
		var subs = this.subscribers();

		if (!subs[name]) {
			subs[name] = [ cb ];
		} else {
			subs[name].push(cb);
		}
	},

	/**
	 * Removes subscribers, inverse of [FB.Event.subscribe](FB.Event.subscribe).
	 *
	 * Removing a subscriber is basically the same as adding one. You need to
	 * pass the same event name and function to unsubscribe that you passed into
	 * subscribe. If we use a similar example to
	 * [FB.Event.subscribe](FB.event.subscribe), we get:
	 *
	 *     var onSessionChange = function(response) {
	 *       // do something with response.session
	 *     };
	 *     FB.Event.subscribe('auth.sessionChange', onSessionChange);
	 *
	 *     // sometime later in your code you dont want to get notified anymore
	 *     FB.Event.unsubscribe('auth.sessionChange', onSessionChange);
	 *
	 * @access public
	 * @param name {String} Name of the event.
	 * @param cb {Function} The handler function.
	 */
	unsubscribe : function(name, cb) {
		var subs = this.subscribers()[name];

		FB.Array.forEach(subs, function(value, key) {
			if (value == cb) {
				subs[key] = null;
			}
		});
	},

	/**
	 * Repeatedly listen for an event over time. The callback is invoked
	 * immediately when monitor is called, and then every time the event
	 * fires. The subscription is canceled when the callback returns true.
	 *
	 * @access private
	 * @param {string} name Name of event.
	 * @param {function} callback A callback function. Any additional arguments
	 * to monitor() will be passed on to the callback. When the callback returns
	 * true, the monitoring will cease.
	 */
	monitor : function(name, callback) {
		if (!callback()) {
			var ctx = this, fn = function() {
				if (callback.apply(callback, arguments)) {
					ctx.unsubscribe(name, fn);
				}
			};

			this.subscribe(name, fn);
		}
	},

	/**
	 * Removes all subscribers for named event.
	 *
	 * You need to pass the same event name that was passed to FB.Event.subscribe.
	 * This is useful if the event is no longer worth listening to and you
	 * believe that multiple subscribers have been set up.
	 *
	 * @access private
	 * @param name    {String}   name of the event
	 */
	clear : function(name) {
		delete this.subscribers()[name];
	},

	/**
	 * Fires a named event. The first argument is the name, the rest of the
	 * arguments are passed to the subscribers.
	 *
	 * @access private
	 * @param name {String} the event name
	 */
	fire : function() {
		var args = Array.prototype.slice.call(arguments), name = args.shift();

		FB.Array.forEach(this.subscribers()[name], function(sub) {
			// this is because we sometimes null out unsubscribed rather than jiggle
			// the array
			if (sub) {
				sub.apply(this, args);
			}
		});
	}
});

/**
 * Event handling mechanism for globally named events.
 *
 * @class FB.Event
 * @extends FB.EventProvider
 */
FB.provide('Event', FB.EventProvider);
