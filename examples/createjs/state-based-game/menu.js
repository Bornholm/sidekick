(function() {

	var MenuButton = Sidekick.entity({




	},['createjs:button']);

	var MenuState = Sidekick.entity({

		initialize: function() {
			this.displayObject = new createjs.Container();
		},

		enter: function() {
			this.context.clearEntities();
			this.context.addEntity(this);
			this._initBackground();
			this._initButtons();
		},

		exit: function() {
			
		},

		_initBackground: function() {

			var g, s,
				game = this.context,
				container = this.displayObject;

			g = new createjs.Graphics();
			s = new createjs.Shape(g);

			s.width = game.getWidth();
			s.height = game.getHeight();

			g.beginFill('#000000');
			g.drawRect(0, 0, s.width, s.height);

			s.cache( 0, 0, s.width, s.height);			

			container.addChild(s);

		},

		_initButtons: function() {

			var game = this.context,
				startButton = new MenuButton();

			startButton.text = "Start";
			game.addEntity(startButton);
		}

	});

	this.StateBasedGame.MenuState = MenuState;

}());