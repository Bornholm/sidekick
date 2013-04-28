(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	var withGame = function() {

		!S.has('entity', this) && S.module('entity').call(this)
		
		S._mark('game', this);

		this.before('initialize', function() {
			this._entities = [];
			this._onAnimationFrameBinded = this._onAnimationFrame.bind(this);
		});

		this._resetClock = function() {
			this._clock = {
				t: 0,
				lastCall: this.now(),
				accumulator: 0
			};
		};

		this.getInterval = function() {
			return (1000/this._fps)|0;
		};

		this.setInterval = function(interval) {
			this._fps = (1000/interval)|0;
		};

		this.getFPS = function() {
			return this._fps;
		};

		this.setFPS = function(fps) {
			this._fps = fps;
		};

		this.clearEntities = function() {
			this._entities.length = 0;
		};

		this.addEntity = function(entity) {
			entity.game = this;
			this._entities.push(entity);
			entity.onEntityAdd && entity.onEntityAdd();
		};

		this.removeEntity = function(entity) {
			var i, len, curr,
				entities = this._entities;
			for(i = 0, len = entities.length; i < len; ++i) {
				if(entities[i] === entity) {
					entity.onEntityRemove && entity.onEntityRemove();
					delete entity.game;
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

		this.start = function() {
			this._resetClock();
			this._rafId = window.requestAnimationFrame(this._onAnimationFrameBinded);
		};

		this._onAnimationFrame = function() {
			this.run();
			window.requestAnimationFrame(this._onAnimationFrameBinded);
		}

		this.stop = function() {
			window.cancelAnimationFrame(this._rafId);
		};

		this.now = (function() {
			var performance = window.performance;
			if(performance && performance.now) {
				return performance.now.bind(performance);
			} else {
				return Date.now
			}
		}());

		this.run = function() {
			
			var alpha,
				self = this,
				clock = self._clock,
				interval = self.getInterval(),
				delta = this.now() - clock.lastCall;

			clock.lastCall = this.now();
			clock.accumulator += delta;

			while( clock.accumulator >= interval ) {
				self.update(clock.t, interval);
				clock.t += interval;
				clock.accumulator -= interval;
			}

			alpha = clock.accumulator / interval;
			self.render( alpha );

		}

	};

	S.module('game', withGame);

}());