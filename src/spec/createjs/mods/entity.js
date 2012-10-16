(function() {
	
	var S = this.Sidekick = this.Sidekick || {};
	S.with = S.with || {};

	var withCreateJsEntity = function() {

		!S.has('entity', this) && S.module('entity').call(this);

		S._mark('createjs:entity', this);

		this.displayObject = null;

	}

	S.module('createjs:entity', withCreateJsEntity);
	
}());