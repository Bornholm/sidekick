(function() {

	var p;

	// Basic Entity

	var Circle = function() {
		this.initialize.apply(this, arguments);
	};

	p = Circle.prototype;

	p.initialize = function() {
		var g = this.graphics = new createjs.Graphics();
		this.displayObject = new createjs.Shape(this.graphics);

		this.x = Math.random()*500;
		this.y = Math.random()*500;
		this.xVelocity = (Math.random() > 0.5 ? -1 : 1)*Math.random()*0.2;
		this.yVelocity = (Math.random() > 0.5 ? 1 : -1)*Math.random()*0.2;

		this.draw();

	};

	p.draw = function() {

		var g = this.graphics,
			radius = Math.random()*10;

		g.setStrokeStyle(1);
		g.beginFill(createjs.Graphics.getRGB((255*Math.random())>>0,(255*Math.random())>>0,(255*Math.random())>>0));
		g.drawCircle(0,0,radius);
		this.displayObject.cache(-radius, -radius, radius*2, radius*2);

	};

	p.update = function(t, dt) {

	 	if( this.x <= 0 || this.x >= 500 ) this.xVelocity = -this.xVelocity;
	 	if( this.y <= 0 || this.y >= 500 ) this.yVelocity = -this.yVelocity;

	 	if(Math.random() > 0.95) {
	 		this.xVelocity = (Math.random() > 0.5 ? -1 : 1)*Math.random()*0.2;
			this.yVelocity = (Math.random() > 0.5 ? -1 : 1)*Math.random()*0.2;
	 	}

	 	this.x += dt * this.xVelocity;
	 	this.y += dt * this.yVelocity;
	};

	p.render = function(interpolate) {
		var dO = this.displayObject;
		dO.x = this.x + this.xVelocity * interpolate;
		dO.y = this.y + this.yVelocity * interpolate;
	};

	Sidekick.with.CreateJsEntity.call(p);

	/// Game

	var BasicGame;

	BasicGame = function() {
		this.initialize.apply(this, arguments);
		var count = 700;
		while(count--)
			this.add(new Circle());
		createjs.Ticker.setFPS(60);
		this.stage.autoClear = true;
	};

	p = BasicGame.prototype;

	Sidekick.with.CreateJsGame.call(p);

	this.BasicGame = BasicGame;

}());