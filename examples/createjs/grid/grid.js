(function() {

	/// Game

	var Grid = Sidekick.entity({

		initialize: function() {

			this.setFPS(60);

			this.addState('load', new Grid.LoadState() );
			this.addState('intro', new Grid.IntroState() );
			this.addState('menu',  new Grid.MenuState() );
			this.addState('game',  new Grid.GameState() );

			this.setState('load');
		}

	}, ['createjs:game', 'states', 'stats']);

	this.Grid = Grid;

}());