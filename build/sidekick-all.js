(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S._require = function(mark, context) {
		var i, len, curr,
			marks = context._componentsMarks;
		if(marks) {
			for(i = 0, len = marks.length; i < len; ++i) {
				curr = marks[i];
				if(curr === mark) return true;
			}
		}
		return false;
	}

}());(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var push = Array.prototype.push,
		noop = function() {};

	var withHelpers = function() {

		this._mark = function(mark) {
			var marks = this._componentsMarks = this._componentsMarks || [];
			marks.push(mark);
		};

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

		this._mark('Helpers');

	};

	S.with.Helpers = withHelpers;

}());(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};
	
	var withEntity = function() {

		if( !S._require('Helpers', this) ) {
			S.with.Helpers.call(this)
		}

		this._mark('Entity');

		!this.update && (this.update = function(deltaTime) {});
		!this.render && (this.render = function(interpolation) {});

	};

	S.with.Entity = withEntity;

}());(function() {
	
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

}());(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withStateBasedGame = function() {

		if( !S._require('Game', this) ) {
			S.with.Game.call(this)
		}

		this._mark('StateBasedGame');

		this.before('initialize', function() {
			this._currentStateName = 'default';
			this._states = {
				'default' : {
					enter: function() {
					},
					exit: function(cb) {
						cb();
					}
				}
			};
			this.setState('default');
		});

		this.addState = function(stateName, state) {
			state.game = this;
			this._states[stateName] = state;
		};

		this.removeState = function(stateName) {
			delete this._states[stateName];
		};

		this.stateExists = function(stateName) {
			return !!this._states[stateName];
		};

		this.isActualState = function(stateName) {
			return this._states[stateName] === this._currentStateName;
		};

		this.setState = function(newStateName) {

			var currentState,
				self = this;

			if( self.stateExists(newStateName) ) {
				if( !self.isActualState(newStateName) ) {
					currentState = this._states[this._currentState];
					if(currentState) {
						currentState.exit && currentState.exit( self._afterCurrentStateExit.bind(self, null, newStateName) );
					} else {
						self._afterCurrentStateExit(null, newStateName);
					}
				}
			} else {
				throw new Error('Unknown state '+newStateName+' !');
			}
		};

		this._afterCurrentStateExit = function(err, newStateName) {
			if(err) throw err;
			var self = this,
				newState = self._states[newStateName];
			self._currentStateName = newStateName;
			newState.enter && newState.enter();
		};

	};


	S.with.StateBasedGame = withStateBasedGame;


}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};
	S.with = S.with || {};

	var withCreateJsEntity = function() {

		if( !S._require('Entity', this) ) {
			S.with.Entity.call(this)
		}

		this._mark('CreateJsEntity');

	}

	S.with.CreateJsEntity = withCreateJsEntity;
	
}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withCreateJsGame = function() {

		if( !S._require('Game', this) ) {
			S.with.Game.call(this)
		}

		this._mark('CreateJsGame');

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