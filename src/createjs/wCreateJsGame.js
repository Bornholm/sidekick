(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withCreateJsGame = function() {

		S.with.Game.call(this);

		this.before('initialize', function(canvasOrId) {
			this.stage = new createjs.Stage(canvasOrId)
		});

		this.after('add', function(entity) {
			this.stage.addChild(entity.displayObject);
		});

		this.after('remove', function(entity) {
			this.stage.removeChild(entity);
		});

		this.start = function() {
			createjs.Ticker.addListener(this, true);
		};

		this.stop = function() {
			createjs.Ticker.removeListener(this);
		};

		this.pause = function(paused) {
			createjs.Ticker.setPaused(paused);
		};

		this.tick = function(deltaTime) {
			this.run(deltaTime);
		};

		this.after('render', function() {
			this.stage.update();
		});

	}

	S.with.CreateJsGame = withCreateJsGame;

}());