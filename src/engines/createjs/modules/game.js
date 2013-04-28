(function() {
	
	var S = this.Sidekick = this.Sidekick || {};


	var withCreateJsGame = function() {

		!S.has('game', this) && S.module('game').call(this);

		S._mark('createjs:game', this);

		this.before('initialize', function(canvasOrId) {
			this._stage = new createjs.Stage(canvasOrId)
		});

		this.addChild = function(displayObject) {
			this._stage.addChild(displayObject);
		};

		this.removeChild = function(displayObject) {
			this._stage.removeChild(displayObject);
		};

		this.removeAllChildren = function() {
			this._stage.removeAllChildren();
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
		};


		this.getStage = function() {
			return this._stage;
		}


		this.after('render', function() {
			this._stage.update();
		});

	}

	S.module('createjs:game', withCreateJsGame);

}());