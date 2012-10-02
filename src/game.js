(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	var withGame = function() {

		S.withEntity.call(this.prototype);

		this.after('initialize', function() {
			
		});

	};

	S.withGame = withGame;

}());