(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};
	
	var withEntity = function() {

		if( !S._require('Helpers', this) ) {
			S.with.Helpers.call(this)
		}

		this._mark('Entity');

		!this.update && (this.update = function(deltaTime) {});
		!this.render && (this.render = function(interpolation) {});

	};

	S.with.Entity = withEntity;

}());