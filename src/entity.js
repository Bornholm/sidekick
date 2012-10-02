(function() {

	this.Sidekick = this.Sidekick || {};
	
	var withEntity,
		push = Array.prototype.push;


	withEntity = function() {

		this.initialize = function() {};
		this.update = function(deltaTime) {};
		this.render = function(deltaTime) {};


		this.before = function(methodName, func) {
			var method = this[methodName];
			this[methodName] = function() {
				func.apply(this, arguments);
				return method.apply(this, arguments);
			};
		};

		this.after = function(methodName, func) {
			var method = this[methodName];
			this[methodName] = function() {
				method.apply(this, arguments);
				return func.apply(this, arguments);
			};
		};

		this.wrap = function(methodName, wrapper) {
			this[methodName] = function() {
				var args = [this[methodName]];
				push.apply(args, arguments);
				return wrapper.apply(this, args);
			};
		};

	};

	this.Sidekick.withEntity = withEntity;

}());