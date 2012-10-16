(function() {

	var S = this.Sidekick = this.Sidekick || {};

	var withEntity = function() {

		!S.has('helpers', this) && S.module('helpers').call(this)

		S._mark('entity', this);

		!this.initialize && (this.initialize = function() {});
		!this.update && (this.update = function(deltaTime) {});
		!this.render && (this.render = function(interpolation) {});

	};

	S.module('entity', withEntity);

}());