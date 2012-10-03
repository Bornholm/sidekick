(function() {

	var p;

	var Circle = function() {
		this.initialize.apply(this, arguments);
	};

	p = Circle.prototype;

	p.initialize = function() {
		var g = this.graphics = new createjs.Graphics();
		this.displayObject = new createjs.Shape(this.graphics);

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,0,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,0));
		g.drawCircle(0,0,3);

		this.displayObject.cache(-3, -3, 6, 6);

		this.displayObject.x = 10;
		this.displayObject.y = 50;
		this.xVelocity = 5;
		this.yVelocity = 1;

	};

	p.update = function(t, dt) {

		var dO = this.displayObject;
	 	if(dO.x > 500) this.xVelocity = -0.1;
	 	if(dO.x < 0) this.xVelocity = 0.1;
	 	if(dO.y > 500) this.yVelocity = -0.1;
	 	if(dO.y < 0) this.yVelocity = 0.1;

	 	dO.x += dt * this.xVelocity;
	 	dO.y += dt * this.yVelocity;
	};

	p.render = function(interpolate) {
		var dO = this.displayObject;
		dO.x = dO.x + this.xVelocity * interpolate;
		dO.y = dO.y + this.yVelocity * interpolate;
	};

	Sidekick.with.CreateJsEntity.call(p);

	/// Game

	var BasicGame;

	BasicGame = function() {
		this.initialize.apply(this, arguments);

		this.add(new Circle());
	};

	p = BasicGame.prototype;

	Sidekick.with.CreateJsGame.call(p);

	this.BasicGame = BasicGame;

}());