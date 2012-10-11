(function() {

	/// Game

	var StateBasedGame;

	StateBasedGame = function() {
		this.initialize.apply(this, arguments);
		this.setFPS(60);
		this.stage.autoClear = true;
	};

	p = StateBasedGame.prototype;

	Sidekick.with.CreateJsGame.call(p);
	Sidekick.with.StateBasedEntity.call(p);

	this.StateBasedGame = StateBasedGame;

}());