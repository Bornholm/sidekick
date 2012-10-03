(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};
	
	var withEntity = function() {

		S.with.Helpers.call(this);

		!this.update && (this.update = function(deltaTime) {});
		!this.render && (this.render = function(interpolation) {});

		this.before('initialize', function() {
			this.isVisible = true;
			this.isActive = true;
		});

	};

	S.with.Entity = withEntity;

}());