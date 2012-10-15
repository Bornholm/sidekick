(function() {

	/// Game

	var StateBasedGame,
		IntroState, GameState;

	StateBasedGame = function() {

		createjs.Ticker.useRAF = true;

		this.initialize.apply(this, arguments);
		this.setFPS(60);

		this.addState('intro', IntroState);
		this.addState('game', GameState);

		this.setState('intro');
	};


	IntroState = {

		enter: function() {

			var game = this.context;

			this.foregroundHeight = game.stage.canvas.height*(1/3);
			this.foregroundWidth =  game.stage.canvas.width;
			this.foregroundY =  game.stage.canvas.height - this.foregroundHeight;
			this.speed = 0.001;
			this.origin = [this.foregroundWidth/2, 0];
			this.points = [];
			this.leftAnchor = [0, this.foregroundHeight],
			this.rightAnchor = [this.foregroundWidth, this.foregroundHeight]

			game.clearEntities();
			game.addEntity(this);

			this._initBackground();
			this._initForeground();
			this._initLines();
			this._initPoints();
			this._initTitle();
		},

		exit: function(callback) {

		},

		render: function(interpolate) {
			this._renderLines(interpolate);
			this._renderTitle();
		},

		update: function(time, delta) {
			this._updatePoints(delta);
		},

		_updatePoints: function(delta) {
			var i, len, xDelta, yDelta,
				speed = this.speed,
				origin = this.origin,
				leftAnchor = this.leftAnchor,
				rightAnchor = this.rightAnchor,
				points = this.points;

			for(i = 0, len = points.length; i < len; i+=4) {
				points[i] += (leftAnchor[0] - origin[0]) * speed * delta;
				points[i+1] += (leftAnchor[1] - origin[1]) * speed * delta;
				points[i+2] += (rightAnchor[0] - origin[0]) * speed * delta;
				points[i+3] += (rightAnchor[1] - origin[1]) * speed * delta;

				if ( points[i] < leftAnchor[0] ) {
					points[i+2] = points[i] = origin[0];
					points[i+3] = points[i+1] = origin[1];
				}
			}
		},

		_renderLines: function(alpha) {

			var i, len, deltaX,
				verticalLines = 9,
				interpolation = this.speed * alpha,
				g = this.lines.graphics,
				origin = this.origin,
				leftAnchor = this.leftAnchor,
				rightAnchor = this.rightAnchor,
				points = this.points;

			g.clear();
			g.beginStroke('#259382');

			deltaX = this.foregroundWidth/verticalLines;

			// Vertical Lines
			for(i = 0, len = verticalLines; i <= len; ++i) {
				g.moveTo(origin[0], origin[1]);
				g.lineTo(deltaX*i, leftAnchor[1]);
			}

			for(i = 0, len = points.length; i < len; i+=4) {
				g.moveTo(points[i] + interpolation, points[i+1] + interpolation);
				g.lineTo(points[i+2] + interpolation, points[i+3] + interpolation);
			}

		},

		_initPoints: function() {

			var points = this.points,
				origin = this.origin,
				leftAnchor = this.leftAnchor,
				rightAnchor = this.rightAnchor,
				totalLines = 5,
				i = 0;

			xDelta = (leftAnchor[0] - origin[0])/totalLines;
			yDelta = (leftAnchor[1] - origin[1])/totalLines;

			for (i = 0; i < totalLines*4; i += 4) {
				points[i] = origin[0] + xDelta * i/4;
				points[i+2] = origin[0] - xDelta * i/4;
				points[i+3] = points[i+1] = origin[1] + yDelta * i/4;
			}

		},

		_initLines: function() {

			var g, s,
				game = this.context,
				stage = game.stage;

			g = new createjs.Graphics();
			s = new createjs.Shape(g);

			s.width = stage.canvas.width;
			s.height = this.foregroundHeight;
			s.y = this.foregroundY;

			this.lines = s;
			stage.addChild(s);

		},

		_initBackground: function() {

			var g, s,
				game = this.context,
				stage = game.stage;

			g = new createjs.Graphics();
			s = new createjs.Shape(g);

			s.width = stage.canvas.width;
			s.height = stage.canvas.height;

			g.beginFill('#000000');
			g.drawRect(0, 0, s.width, s.height);

			s.cache( 0, 0, s.width, s.height);			

			stage.addChild(s);

		},

		_initForeground: function() {

			var g, s,
				game = this.context,
				stage = game.stage;

			g = new createjs.Graphics();
			s = new createjs.Shape(g);

			s.width = this.foregroundWidth;
			s.height = this.foregroundHeight;

			g.beginFill('#113832');
			g.drawRect(0, 0, s.width, s.height);

			s.cache( 0, 0, s.width, s.height);

			s.y = this.foregroundY;

			stage.addChild(s);

		},

		_initTitle: function() {
			var g, s, 
				title, uptitle, subtitle,
				game = this.context,
				stage = game.stage;

			uptitle = new createjs.Text('The');
			title = new createjs.Text('GRID');
			subtitle = new createjs.Text('A fan game');
			
			uptitle.font = subtitle.font = "4px Abstract";

			title.font = "36px Abstract";
			title.lineHeight = 48;
			title.outline = true;

			subtitle.color = uptitle.color = title.color = '#259382';

			this.uptitle = uptitle;
			this.title = title;
			this.subtitle = subtitle;

			stage.addChild(uptitle);
			stage.addChild(title);
			stage.addChild(subtitle);
			
		},

		_renderTitle: function() {

			var title = this.title,
				subtitle = this.subtitle,
				uptitle = this.uptitle,
				game = this.context,
				stage = game.stage;

			title.x = this.foregroundWidth/2 - title.getMeasuredWidth()/2;
			title.y = (stage.canvas.height-this.foregroundHeight)/2 - title.getMeasuredHeight()/2;
			uptitle.y = title.y - uptitle.getMeasuredHeight();
			uptitle.x = title.x;
			subtitle.x = title.x + title.getMeasuredWidth() - subtitle.getMeasuredWidth()*1.1;
			subtitle.y = title.y + title.getMeasuredHeight();
		}

	};

	Sidekick.with.Entity.call(IntroState);

	p = StateBasedGame.prototype;

	Sidekick.with.CreateJsGame.call(p);
	Sidekick.with.StateBasedEntity.call(p);

	this.StateBasedGame = StateBasedGame;

}());