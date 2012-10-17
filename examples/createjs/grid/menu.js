(function() {

	var MenuButton = Sidekick.entity({

		initialize: function() {

			this.displayObject = new createjs.Container();
			
			this._initBackground();
			this._initText();

			this.setFont('8px Abstract', 'normal');
			this.setTextColor('white', 'normal');
			this.setBackgroundColor('#113832', 'normal');

			this.setFont('8px Abstract', 'hover');
			this.setTextColor('white', 'hover');
			this.setBackgroundColor('#259382', 'hover');

		},

		getWidth: function() {
			return this._text.getMeasuredWidth();
		},

		getHeight: function() {
			return this._text.getMeasuredWidth();
		},

		setTextColor: function(c, stateName) {
			stateName = stateName || this.getCurrentStateName();
			var state = this.getState(stateName);
			state.textColor = c;
		},

		setBackgroundColor: function(c, stateName) {
			stateName = stateName || this.getCurrentStateName();
			var state = this.getState(stateName);
			state.backgroundColor = c;
		},

		setFont: function(f, stateName) {
			stateName = stateName || this.getCurrentStateName();
			var state = this.getState(stateName);
			state.font = f;
		},

		setLabel: function(l, stateName) {
			this._label = l;
		},

		_initText: function() {
			var text = new createjs.Text();
			this._text = text;
			this.displayObject.addChild(text);
		},

		_initBackground: function() {
			var background = new createjs.Shape();
			this._background = background;
			this.displayObject.addChild(background);
		},

		render: function(interpolate) {

			var g,
				currentState = this.getCurrentState(),
				background = this._background,
				text = this._text;

			text.text = this._label;
			text.font = currentState.font;
			text.color = currentState.textColor;

			g = background.graphics;
			g.clear();
			g.beginFill(currentState.backgroundColor);
			g.drawRect(0, 0, this.getWidth(), this.getHeight());
			g.endFill();

		}


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

			startButton.setLabel("Start");
			startButton.displayObject.x = game.getWidth()/2-startButton.getWidth()/2;
			startButton.displayObject.y = game.getHeight()/2-startButton.getHeight()/2;

			game.addEntity(startButton);
		}

	});

	this.StateBasedGame.MenuState = MenuState;

}());