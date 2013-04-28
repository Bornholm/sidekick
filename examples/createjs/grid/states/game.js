(function() {

	var Level = Sidekick.entity({

		initialize: function() {
			this.displayObject = new createjs.Container();
			this.width = 2048;
			this.height = 2048;
			this.cameraPosX = this.cameraPosY = 0;
			this._initBackground();
		},

		onEntityAdd: function() {
			this._initCycleSpriteSheet();
			this._initCycles();
			this._resetCyclePosition();
		},

		_initCycles: function() {
			var cycle = new Cycle(this.cycleSpriteSheet);
			this.game.addEntity(cycle);
			this.displayObject.addChild(cycle.displayObject);
			this.cycle = cycle;
		},

		_initCycleSpriteSheet: function() {
			var data,
				assets = this.game.assets,
				bikeAsset = assets['red_bike'];
			data = Object.create(bikeAsset.data);
			data.images = [bikeAsset.result];
			this.cycleSpriteSheet = new createjs.SpriteSheet(data)
		},

		_initBackground: function() {

			var i,
				vSpace = 64,
				hSpace = 64,
				vLines = Math.floor(this.width/hSpace), 
				hLines = Math.floor(this.height/vSpace),
				g = new createjs.Graphics(),
				bkg = new createjs.Shape(g);

			g.beginFill('#113832');
			g.setStrokeStyle(25);
			g.beginStroke('#259382');
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

		render: function() {
			this.displayObject.x = this.x;
			this.displayObject.y = this.y;
		},


		update: function(time, delta) {

			var game = this.game,
				cycle = this.cycle;

			// Update camera position

			this.x = game.getWidth()/2 - cycle.x;
			this.y = game.getHeight()/2 - cycle.y;

			// check collision
			this._checkCollision();
		},

		_checkCollision: function() {
			var cycle = this.cycle;
			if(cycle.x < 0 || cycle.y < 0 || cycle.x > this.width || cycle.y > this.height) {
				this._resetCyclePosition();
			}
		},

		_resetCyclePosition: function() {
			var cycle = this.cycle;
			cycle.x = this.width/2;
			cycle.y = this.height/2;
		}


	}, ['createjs:entity']);

	var Cycle = Sidekick.entity({

		faces : {
			north: 0,
			east: 90,
			south: 180,
			west: -90
		},

		initialize: function(spriteSheet) {
			this.displayObject = new createjs.BitmapAnimation(spriteSheet);
			this.displayObject.gotoAndPlay('idle');
			this.faceTo('east');
			this.relVelocity = 0.32;
			this.x  = 100;
			this.y = 100;
		},

		faceTo: function(orientation) {
			this.orientation = orientation;
		},

		applyInputs: function() {
			var self = this;
			if(self.isKeyDown(37)) {
				self.faceTo('west');
			} else if(self.isKeyDown(38)) {
				self.faceTo('north');
			} else if (self.isKeyDown(39)) {
				self.faceTo('east')
			} else if (self.isKeyDown(40)) {
				self.faceTo('south');
			}
		},

		update: function(time, delta) {
			this.applyInputs();
			switch(this.orientation) {
				case 'north':
				case 'south':
					this.y += (this.relVelocity * delta) * (this.orientation === 'north' ? -1 : 1);
				break;
				case 'east':
				case 'west':
					this.x += (this.relVelocity * delta) * (this.orientation === 'west' ? -1 : 1);
				break;
			}
			
		},

		render: function(alpha) {
			this.displayObject.rotation = this.faces[this.orientation];
			this.displayObject.x = (this.x + this.relVelocity * alpha);
			this.displayObject.y = (this.y + this.relVelocity * alpha);
		},


	}, ['createjs:entity', 'keyboard'])
	
	var GameState = Sidekick.entity({

		enter: function() {
			var game = this.context;
			game.clearEntities();
			this._initGame();
		},

		_initGame: function() {
			
			var game = this.context,
				level = new Level();

			game.addEntity(level);
			game.addChild(level.displayObject);

			this.level = level;

			this.cameraPosX = this.cameraPosY = 0;
		}

		

	}, ['createjs:entity']);

	this.Grid.GameState = GameState;

}());