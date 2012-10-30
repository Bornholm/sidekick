(function() {

	var MenuButton = Sidekick.entity({

		initialize: function() {

			this.displayObject = new createjs.Container();
			
			this._initBackground();
			this._initText();

			this.getText().lineHeight = 11;

			this.setPadding({left: 5, right: 2, top: 7, bottom: 5});
			this.setFont('6px Abstract');
			this.setTextColor('white');
			this.setBorderColor('#259382');
			this.setBackgroundColor('#113832');

			this.setBackgroundColor('#259382', 'hover');
			this.setBorderColor('white', 'hover');

		},

		getWidth: function() {
			return this._text.getMeasuredWidth();
		},

		getHeight: function() {
			return this._text.getMeasuredHeight();
		},

		setBorderColor: function(c, stateName) {
			this._set('borderColor', c, stateName);
		},

		setBorderStyle: function(s, stateName) {
			this._set('borderStyle', s, stateName);
		},

		setPadding: function(p, stateName) {
			this._set('padding', p, stateName);
		},

		setTextColor: function(c, stateName) {
			this._set('textColor', c, stateName);
		},

		setBackgroundColor: function(c, stateName) {
			this._set('backgroundColor', c, stateName);
		},

		setFont: function(f, stateName) {
			this._set('font', f, stateName);
		},

		_set: function(propertyName, val, stateName) {
			var s,
				self = this;
			if(!stateName) {
				s = self.getStates();
				for(stateName in s) {
					if(s.hasOwnProperty(stateName)) {
						self._set(propertyName, val, stateName);
					}
				}
			} else {
				s = self.getState(stateName);
				s[propertyName] = val;
			}
		},

		setLabel: function(l, stateName) {
			this._set('label', l, stateName);
		},

		getText: function() {
			return this._text;
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
				borderStyle = currentState.borderStyle || {},
				padding = currentState.padding,
				text = this._text;

			text.x = +padding.left;
			text.y = +padding.top;

			text.text = currentState.label;
			text.font = currentState.font;
			text.color = currentState.textColor;

			g = background.graphics;
			g.clear();
			g.setStrokeStyle(+borderStyle.thickness, borderStyle.caps, borderStyle.joints, borderStyle.miter);
			g.beginStroke(currentState.borderColor);
			g.beginFill(currentState.backgroundColor);
			g.drawRect(0, 0, this.getWidth()+padding.left+padding.right, this.getHeight()+padding.top+padding.bottom);
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

			startButton.onClick(this.onStartClick.bind(this));

			game.addEntity(startButton);
			
		},

		onStartClick: function() {
			this.context.setState('game');
		},

		exit: function() {
			this.context.clearEntities();
		}

	}, ['createjs:entity']);

	this.Grid.MenuState = MenuState;

}());