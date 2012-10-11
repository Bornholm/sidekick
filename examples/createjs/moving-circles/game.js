(function() {

	/// Game

	var BasicGame, p;

	BasicGame = function() {
		this.initialize.apply(this, arguments);
		var count = 700;
		while(count--)
			this.addEntity(new Circle());
		createjs.Ticker.setFPS(60);
		this.stage.autoClear = true;
	};

	p = BasicGame.prototype;

	Sidekick.with.CreateJsGame.call(p);

	this.BasicGame = BasicGame;

}());