(function() {

	var BasicGame, p;

	BasicGame = function() {
		this.initialize.apply(this, arguments);
	};

	p = BasicGame.prototype;

	Sidekick.with.CreateJsGame.call(p);

	this.BasicGame = BasicGame;

}());