(function() {
	
	var S = this.Sidekick = this.Sidekick || {};
	S.with = S.with || {};

	var withCreateJsEntity = function() {

		if( !S._require('Entity', this) ) {
			S.with.Entity.call(this)
		}

		this._mark('CreateJsEntity');

	}

	S.with.CreateJsEntity = withCreateJsEntity;
	
}());