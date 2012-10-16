(function() {

	/// Game

	var StateBasedGame;

	StateBasedGame = function() {

		createjs.Ticker.useRAF = true;

		this.initialize.apply(this, arguments);
		this.setFPS(60);

		this.addState('intro', StateBasedGame.IntroState);
		this.addState('menu',  StateBasedGame.MenuState);
		this.addState('game',  StateBasedGame.GameState);

		this.setState('intro');
	};
	
	p = StateBasedGame.prototype;

	Sidekick.with.CreateJsGame.call(p);
	Sidekick.with.StateBasedEntity.call(p);
	Sidekick.with.Stats.call(p);

	this.StateBasedGame = StateBasedGame;

}());