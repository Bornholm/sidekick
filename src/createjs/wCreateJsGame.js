(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withCreateJsGame = function() {

		if( !S._require('Game', this) ) {
			S.with.Game.call(this)
		}

		this._mark('CreateJsGame');

		this.before('initialize', function(canvasOrId) {
			this.stage = new createjs.Stage(canvasOrId)
		});

		this.after('addEntity', function(entity) {
			this.stage.addChild(entity.displayObject);
		});

		this.after('removeEntity', function(entity) {
			this.stage.removeChild(entity.displayObject);
		});

		this.after('setInterval', function(interval) {
			createjs.Ticker.setInterval(interval);
		});

		this.after('setFPS', function(fps) {
			createjs.Ticker.setFPS(fps);
		});

		this.before('getFPS', function() {
			this._fps = createjs.Ticker.getFPS();
		});

		this.before('getInterval', function() {
			this._fps = createjs.Ticker.getFPS();
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