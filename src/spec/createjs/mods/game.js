(function() {
	
	var S = this.Sidekick = this.Sidekick || {};


	var withCreateJsGame = function() {

		!S.has('game', this) && S.module('game').call(this);

		S._mark('createjs:game', this);

		this.before('initialize', function(canvasOrId) {
			createjs.Ticker.useRAF = true;
			this._stage = new createjs.Stage(canvasOrId)
		});

		this.after('addEntity', function(entity) {
			this._stage.addChild(entity.displayObject);
		});

		this.after('removeEntity', function(entity) {
			this._stage.removeChild(entity.displayObject);
		});

		this.after('clearEntities', function() {
			this._stage.removeAllChildren();
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

		this.getWidth = function() {
			return this._stage.canvas.width;
		};

		this.setWidth = function(w) {
			this._stage.canvas.width = w;
		};

		this.getHeight = function() {
			return this._stage.canvas.height;
		};

		this.setHeight = function(h) {
			this._stage.canvas.height = h;
		}


		this.after('render', function() {
			this._stage.update();
		});

	}

	S.module('createjs:game', withCreateJsGame);

}());