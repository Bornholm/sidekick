(function() {

	/// Game

	var BasicGame = Sidekick.entity({

		initialize: function() {
			var count = 700;
			while(count--)
				this.addEntity(new Circle());
			this.setFPS(60);
		}

	}, ['createjs:game', 'stats']);

	this.BasicGame = BasicGame;

}());