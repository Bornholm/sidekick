(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var push = Array.prototype.push,
		noop = function() {};

	withHelpers = function() {

		this.before = function(methodName, func) {
			var method = this[methodName] || noop;
			this[methodName] = function() {
				func.apply(this, arguments);
				return method.apply(this, arguments);
			};
		};

		this.after = function(methodName, func) {
			var method = this[methodName] || noop;
			this[methodName] = function() {
				method.apply(this, arguments);
				return func.apply(this, arguments);
			};
		};

		this.wrap = function(methodName, wrapper) {
			var method = this[methodName] || noop;
			this[methodName] = function() {
				var args = [method];
				push.apply(args, arguments);
				return wrapper.apply(this, args);
			};
		};

	};

	S.with.Helpers = withHelpers;

}());(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};
	
	var withEntity = function() {

		S.with.Helpers.call(this);

		!this.update && (this.update = function(deltaTime) {});
		!this.render && (this.render = function(interpolation) {});

	};

	S.with.Entity = withEntity;

}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withGame = function() {

		S.with.Helpers.call(this);

		this.before('initialize', function() {
			this._entities = [];
			this._clock = {
				t: 0,
				dt: 1000/60,
				lastCall: Date.now(),
				accumulator: 0
			}
		});

		this.add = function(entity) {
			this._entities.push(entity);
		};

		this.remove = function(entity) {
			var i, len, curr,
				entities = this._entities;
			for(i = 0, len = entities.length; i < len; ++i) {
				if(entities[i] === entity) {
					entities.splice(i, 1);
					return;
				}
			}
		};

		this.update = function(time, deltaTime) {
			var i, len,
				entities = this._entities;
			for(i = 0, len = entities.length; i < len; ++i) {
				entities[i].update(time, deltaTime);
			}
		};

		this.render = function(interpolation) {
			var i, len,
				entities = this._entities;
			for(i = 0, len = entities.length; i < len; ++i) {
				entities[i].render(interpolation);
			}
		};

		this.run = function(deltaTime) {
			
			var alpha,
				clock = this._clock,
				delta = Date.now() - clock.lastCall;

			clock.lastCall = Date.now();
			clock.accumulator += delta;

			while( clock.accumulator >= clock.dt ) {
				this.update(clock.t, clock.dt);
				clock.t += clock.dt;
				clock.accumulator -= clock.dt;
			}

			alpha = clock.accumulator / clock.dt;
			this.render( alpha );

		}

	};

	S.with.Game = withGame;

}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};
	S.with = S.with || {};

	var withCreateJsEntity = function() {

		S.with.Entity.call(this);

	}

	S.with.CreateJsEntity = withCreateJsEntity;
	
}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withCreateJsGame = function() {

		S.with.Game.call(this);

		this.before('initialize', function(canvasOrId) {
			this.stage = new createjs.Stage(canvasOrId)
		});

		this.after('add', function(entity) {
			this.stage.addChild(entity.displayObject);
		});

		this.after('remove', function(entity) {
			this.stage.removeChild(entity);
		});

		this.start = function() {
			createjs.Ticker.addListener(this, true);
		};

		this.stop = function() {
			createjs.Ticker.removeListener(this);
		};

		this.pause = function(paused) {
			createjs.Ticker.setPaused(paused);
		};

		this.tick = function(deltaTime) {
			this.run(deltaTime);
		};

		this.after('render', function() {
			this.stage.update();
		});

	}

	S.with.CreateJsGame = withCreateJsGame;

}());