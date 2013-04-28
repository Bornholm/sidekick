(function() {

	/// Game

	var BasicGame = Sidekick.entity({

		initialize: function() {
			var count = 1000;
			while(count--) {
				var circle = new Circle();
				this.addEntity(circle);
				this.addChild(circle.displayObject);
			}
				
			this.setFPS(60);
		}

	}, ['createjs:game', 'stats']);

	this.BasicGame = BasicGame;

}());