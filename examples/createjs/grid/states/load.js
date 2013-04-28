(function() {

	var ASSETS = [
		{ src: 'assets/fonts/abstract.ttf' },
		{ 
			src: 'assets/sprites/red_bike.png', 
			id: 'red_bike', 
			data: {
				frames: {width: 16, height:32, regX: 8, regY: 32},
				animations: {
					idle: [0,15]
				}
			} 
		}
	];

	var LoadState = Sidekick.entity({

		initialize: function() {
			this.displayObject = new createjs.Shape();
		},

		enter: function() {

			var loader = this.loader = new createjs.PreloadJS();
			loader.onProgress = this._onLoadProgress.bind(this);
			loader.onError = this._onLoadError.bind(this);
			loader.onComplete = this._onLoadComplete.bind(this);
			loader.loadManifest(ASSETS);

			this.context.addEntity(this);
			this.context.addChild(this.displayObject);
		},

		exit: function(cb) {
			this.context.removeAllChildren();
			cb();
		},

		_onLoadError: function() {
			console.log(arguments);
		},

		_onLoadComplete: function() {

			var game = this.context,
				loader = this.loader,
				assets = game.assets = {};

			ASSETS.forEach(function(asset) {
				var id = asset.id ? asset.id : asset.src ? asset.src : asset.toString();
				assets[id] = loader.getResult(id);
			});

			this.context.setState('intro');
			//this.context.setState('game');
		},

		_onLoadProgress: function(evt) {
			this.progression = evt.loaded;
		},

		render: function() {

			var dO = this.displayObject,
				game = this.context,
				width = game.getWidth(),
				height = game.getHeight(),
				progressBarHeight = 2,
				progressBarWidth = this.progression*(width),
				graphics = dO.graphics;

			graphics.clear();

			graphics.beginFill('#000000');
			graphics.drawRect(0, 0, width, height);

			graphics.beginFill('#259382');
			graphics.drawRect(width/2 - progressBarWidth/2, height/2-progressBarHeight/2, progressBarWidth, progressBarHeight);

		}

	}, ['createjs:entity']);

	this.Grid.LoadState = LoadState;
}());