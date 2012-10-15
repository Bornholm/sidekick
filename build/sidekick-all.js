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

		this.wrap = function(methodName, func) {
			var method = this[methodName] || noop;
			this[methodName] = function() {
				var args = [method];
				push.apply(args, arguments);
				return func.apply(this, args);
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

		this.clearEntities = function() {
			this._entities.length = 0;
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

}());(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withStateBasedEntity = function() {

		if( !S._require('Entity', this) ) {
			S.with.Entity.call(this)
		}

		this._mark('StateBasedEntity');

		this.before('initialize', function() {
			this._currentStateName = 'default';
			this._states = {
				'default' : {
					enter: function(entity) {
					},
					exit: function(entity, cb) {
						cb();
					}
				}
			};
			this.setState('default');
		});

		this.addState = function(stateName, state) {
			state = state || {};
			state.context = this;
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
						currentState.exit && currentState.exit( self, self._afterCurrentStateExit.bind(self, null, newStateName) );
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
			newState.enter && newState.enter(self);
		};

	};

	S.with.StateBasedEntity = withStateBasedEntity;


}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};
	S.with = S.with || {};

	var withCreateJsEntity = function() {

		if( !S._require('Entity', this) ) {
			S.with.Entity.call(this)
		}

		this._mark('CreateJsEntity');

		this.displayObject = null;

	}

	S.with.CreateJsEntity = withCreateJsEntity;
	
}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withCreateJsGame = function() {

		if( !S._require('Game', this) ) {
			S.with.Game.call(this);
		}

		this._mark('CreateJsGame');

		this.before('initialize', function(canvasOrId) {
			this.stage = new createjs.Stage(canvasOrId)
		});

		this.after('addEntity', function(entity) {
			this.stage.addChild(entity.displayObject);
		});

		this.after('removeEntity', function(entity) {
			this.stage.removeChild(entity.displayObject);
		});

		this.after('clearEntities', function() {
			this.stage.removeAllChildren();
		});

		this.after('setInterval', function(interval) {
			createjs.Ticker.setInterval(interval);
		});

		this.after('setFPS', function(fps) {
			createjs.Ticker.setFPS(fps);
		});

		this.before('getFPS', function() {
			this._fps = createjs.Ticker.getFPS();
		});

		this.before('getInterval', function() {
			this._fps = createjs.Ticker.getFPS();
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