(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var push = Array.prototype.push,
		noop = function() {};

	withHelpers = function() {

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

		this.wrap = function(methodName, wrapper) {
			var method = this[methodName] || noop;
			this[methodName] = function() {
				var args = [method];
				push.apply(args, arguments);
				return wrapper.apply(this, args);
			};
		};

	};

	S.with.Helpers = withHelpers;

}());