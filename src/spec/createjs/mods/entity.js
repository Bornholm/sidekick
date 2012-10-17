(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	var withCreateJsEntity = function() {

		!S.has('entity', this) && S.module('entity').call(this);

		S._mark('createjs:entity', this);

		!this.onEntityAdd && (this.onEntityAdd = function() {});
		!this.onEntityRemove && (this.onEntityRemove = function() {});

	}

	S.module('createjs:entity', withCreateJsEntity);
	
}());