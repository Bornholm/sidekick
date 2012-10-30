(function() {

	var S = this.Sidekick = this.Sidekick || {};

	var push = Array.prototype.push,
		noop = function() {};

	var withHelpers = function() {

		this.before = function(methodName, func) {
			var method = this[methodName] || noop;
			this[methodName] = function() {
				func.apply(this, arguments);
				return method.apply(this, arguments);
			};
		};

		this.after = function(methodName, func) {
			var method = this[methodName] || noop;
			this[methodName] = function() {
				method.apply(this, arguments);
				return func.apply(this, arguments);
			};
		};

		this.wrap = function(methodName, func) {
			var method = this[methodName] || noop;
			this[methodName] = function() {
				var args = [method];
				push.apply(args, arguments);
				return func.apply(this, args);
			};
		};

		S._mark('helpers', this);

	};

	S.module('helpers', withHelpers)

}());