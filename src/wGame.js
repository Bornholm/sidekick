(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withGame = function() {

		if( !S._require('Entity', this) ) {
			S.with.Entity.call(this)
		}

		this._mark('Game');

		this.before('initialize', function() {
			this._entities = [];
			this._clock = {
				t: 0,
				lastCall: Date.now(),
				accumulator: 0
			}
		});

		this.getInterval = function() {
			return 1/this._fps;
		};

		this.setInterval = function(interval) {
			this._fps = 1/interval;
		};

		this.getFPS = function() {
			return this._fps;
		};

		this.setFPS = function(fps) {
			this._fps = fps;
		};

		this.addEntity = function(entity) {
			this._entities.push(entity);
		};

		this.removeEntity = function(entity) {
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
				self = this,
				clock = self._clock,
				interval = self.getInterval() * 1000,
				delta = Date.now() - clock.lastCall;

			clock.lastCall = Date.now();
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

	S.with.Game = withGame;

}());