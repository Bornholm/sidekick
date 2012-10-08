(function() {

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


}());