(function() {

	var S = this.Sidekick = this.Sidekick || {},
		modules = {};

	S.module = function(name, module) {
		if(arguments.length === 1) {
			return modules[name]
		} else if(arguments.length === 2) {
			modules[name] = module;
		}
	};

}());