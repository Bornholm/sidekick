(function() {

	/// Game

	var StateBasedGame = Sidekick.entity({

		initialize: function() {

			this.setFPS(60);

			this.addState('intro', new StateBasedGame.IntroState() );
			this.addState('menu',  new StateBasedGame.MenuState() );
			//this.addState('game',  StateBasedGame.GameState);

			this.setState('intro');
		}

	}, ['createjs:game', 'states', 'stats']);

	this.StateBasedGame = StateBasedGame;

}());