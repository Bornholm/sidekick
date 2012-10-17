(function() {

	var S = this.Sidekick = this.Sidekick || {};


	var extend = function(src, dest) {
			var key;
			for (key in src) {
				dest[key] = src[key];
			}
		},
		getEntity = function() {
			return function Entity() {
				this.initialize.apply(this, arguments);
			};
		};
	
	S.entity = function(src, modules) {

		modules = modules || [];

		var i, len, module,
			e = getEntity();
			p = e.prototype;

		extend(src, p);

		S.module('entity').call(p);

		for(i = 0, len = modules.length; i < len; ++i) {
			module = S.module(modules[i]);
			if(module) {
				module.call(p);
			} else throw new Error('Module "'+modules[i]+'" is undefined !');
		}

		return e;
	};

}());