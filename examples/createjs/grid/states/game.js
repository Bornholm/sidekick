(function() {

	var Level = Sidekick.entity({

		initialize: function() {
			this.displayObject = new createjs.Container();
			this.displayObject.snapToPixel = true;
			this.width = 800;
			this.height = 600;
			this.cameraPosX = this.cameraPosY = 0;
			this._initBackground();
		},

		_initBackground: function() {

			var i,
				vSpace = 50,
				hSpace = 50,
				vLines = Math.floor(this.width/hSpace), 
				hLines = Math.floor(this.height/vSpace),
				g = new createjs.Graphics(),
				bkg = new createjs.Shape(g);

			g.beginFill('#113832');
			g.drawRect(0, 0, this.width, this.height);

			g.beginStroke('#259382');
			g.setStrokeStyle(1);
			for( i = 1; i <= vLines; ++i) {
				g.moveTo(0.5+i*hSpace, 0);
				g.lineTo(0.5+i*hSpace, this.height);
			}
			for( i = 1; i <= hLines; ++i) {
				g.moveTo(0, i*hSpace+0.5);
				g.lineTo(this.width, i*hSpace+0.5);
			}

			bkg.cache(0, 0, this.width, this.height);
			this.displayObject.addChild(bkg);

		},

		render: function(alpha) {
			this.displayObject.x = -this.cameraPosX + 0.1 * alpha;
			this.displayObject.y = -this.cameraPosY + 0.1 * alpha;
		}


	}, ['createjs:entity']);

	var Cycle = Sidekick.entity({

	}, ['createjs:entity'])
	
	var GameState = Sidekick.entity({

		enter: function() {
			var game = this.context;
			game.clearEntities();
			game.addEntity(this);
			this._initGame();
		},

		_initGame: function() {
			
			var game = this.context,
				level = new Level(),
				cycle = new Cycle();

			game.addEntity(level);
			game.addEntity(cycle);

			this.level = level;
			this.cycle = cycle;

			this.cameraPosX = this.cameraPosY = 0;
		},

		update: function(time, delta) {

			this.level.cameraPosX = this.cameraPosX;
			this.level.cameraPosY = this.cameraPosY;

			this.cameraPosX += delta * 0.01;
			this.cameraPosY += delta * 0.01;
		}

	}, ['createjs:entity']);

	this.Grid.GameState = GameState;

}());