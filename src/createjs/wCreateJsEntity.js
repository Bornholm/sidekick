(function() {
	
	var S = this.Sidekick = this.Sidekick || {};
	S.with = S.with || {};

	var withCreateJsEntity = function() {

		S.with.Entity.call(this);

	}

	S.with.CreateJsEntity = withCreateJsEntity;
}());