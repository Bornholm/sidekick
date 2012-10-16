(function() {

	var IntroState = Sidekick.entity({

		initialize: function() {
			this.displayObject = new createjs.Container();
		},

		enter: function() {

			var game = this.context;

			this.foregroundHeight = game.getHeight()*(1/3);
			this.foregroundWidth =  game.getWidth();
			this.foregroundY =  game.getHeight() - this.foregroundHeight;
			this.speed = 0.001;
			this.origin = [this.foregroundWidth/2, 0];
			this.points = [];
			this.leftAnchor = [0, this.foregroundHeight],
			this.rightAnchor = [this.foregroundWidth, this.foregroundHeight]

			game.clearEntities();
			game.addEntity(this);

			this._initBackground();
			this._initForeground();
			this._initPoints();
			this._initTexts();

			this.keyBinding = KeyboardJS.bind.key('enter', this._onEnter.bind(this));
		},

		exit: function(callback) {
			this._dispatchExit = callback;
			this._transitionMode = true;
		},

		render: function(interpolate) {
			this._renderForeground(interpolate);
			this._renderTexts();
		},

		update: function(time, delta) {
			this._updatePoints(delta);
			this._blink(delta);
			this._doTransition();
		},

		_onEnter: function() {
			this.keyBinding.clear();
			this.context.setState('menu');
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

		_renderForeground: function(alpha) {

			var i, len, deltaX,
				verticalLines = 9,
				interpolation = this.speed * alpha,
				g = this.foreground.graphics,
				origin = this.origin,
				leftAnchor = this.leftAnchor,
				rightAnchor = this.rightAnchor,
				points = this.points;

			g.clear();

			g.beginFill('#113832');
			g.drawRect(0, 0, this.foregroundWidth, this.foregroundHeight);
			g.endFill();
			
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

		_initForeground: function() {

			var g, s,
				game = this.context,
				container = this.displayObject;

			g = new createjs.Graphics();
			s = new createjs.Shape(g);

			s.width = this.foregroundWidth;
			s.height = this.foregroundHeight;

			s.y = this.foregroundY;

			this.foreground = s;

			container.addChild(s);

		},

		_initTexts: function() {
			var g, s, 
				title, uptitle, subtitle, callAction,
				game = this.context,
				container = this.displayObject;

			callAction = new createjs.Text('Press [ENTER] to play');
			uptitle = new createjs.Text('The');
			title = new createjs.Text('GRID');
			subtitle = new createjs.Text('A fan game');
			
			callAction.font = uptitle.font = subtitle.font = "4px Abstract";

			title.font = "36px Abstract";
			title.lineHeight = 48;
			title.outline = true;

			callAction.color = '#ffffff';
			subtitle.color = uptitle.color = title.color = '#259382';

			this.uptitle = uptitle;
			this.title = title;
			this.subtitle = subtitle;
			this.callAction = callAction;

			container.addChild(uptitle);
			container.addChild(title);
			container.addChild(subtitle);
			container.addChild(callAction);
			
		},

		_renderTexts: function() {

			var title = this.title,
				callAction = this.callAction,
				subtitle = this.subtitle,
				uptitle = this.uptitle,
				game = this.context,
				container = this.displayObject;

			title.x = this.foregroundWidth/2 - title.getMeasuredWidth()/2;
			title.y = (game.getHeight()-this.foregroundHeight)/2 - title.getMeasuredHeight()/2;
			uptitle.y = title.y - uptitle.getMeasuredHeight();
			uptitle.x = title.x;
			subtitle.x = title.x + title.getMeasuredWidth() - subtitle.getMeasuredWidth()*1.1;
			subtitle.y = title.y + title.getMeasuredHeight();

			callAction.x = this.foregroundWidth/2 - callAction.getMeasuredWidth()/2;
			callAction.y = this.foregroundY - (title.y + title.getMeasuredHeight())/2;

		},

		_blink: function(delta) {
			this._blinkAcc = (this._blinkAcc || 1) + delta;
			if(this._blinkAcc > 800) {
				this.callAction.visible = !this.callAction.visible;
				this._blinkAcc = 0;
			}
			if(this._transitionMode) {
				this.callAction.visible = false;
			}
		},

		_doTransition: function() {

			if(this._transitionMode) {

				var title = this.title,
					foreground = this.foreground,
					callAction = this.callAction,
					subtitle = this.subtitle,
					uptitle = this.uptitle;

				foreground.alpha = uptitle.alpha = subtitle.alpha = callAction.alpha = title.alpha -= 0.02;
				this.speed += 0.0005;

				if(foreground.alpha <= 0) {
					this._dispatchExit();
				}

			}
		}

	}, ['createjs:entity']);

	this.StateBasedGame.IntroState = IntroState;

}());