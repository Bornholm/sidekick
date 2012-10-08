(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withGame = function() {

		if( !S._require('Helpers', this) ) {
			S.with.Helpers.call(this)
		}

		this._mark('Game');

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

}());