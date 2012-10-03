(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};
	
	var withEntity = function() {

		S.with.Helpers.call(this);

		this.update = function(deltaTime) {};
		this.render = function(deltaTime) {};

		this.before('initialize', function() {
			this.isVisible = true;
			this.isActive = true;
		});

	};

	S.with.Entity = withEntity;

}());