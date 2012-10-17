(function() {

	var S = this.Sidekick = this.Sidekick || {};

	var withStates = function() {

		!S.has('helpers', this) && S.module('helpers').call(this)

		S._mark('states', this);

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

		this.getCurrentState = function() {
			return this._states[this._currentStateName];
		};

		this.getCurrentStateName = function() {
			return this._currentStateName;
		};

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

		this.isCurrentState = function(stateName) {
			return this._states[stateName] === this._currentStateName;
		};

		this.setState = function(newStateName) {

			console.log('Enter State:', newStateName);

			var currentState,
				self = this;

			if( self.stateExists(newStateName) ) {
				if( !self.isCurrentState(newStateName) ) {
					currentState = this._states[this._currentStateName];
					if(currentState && currentState.exit) {
						currentState.exit( self._afterCurrentStateExit.bind(self, newStateName) );
					} else {
						self._afterCurrentStateExit(newStateName);
					}
				}
			} else {
				throw new Error('Unknown state '+newStateName+' !');
			}
		};

		this.getState = function(stateName) {
			return this._states[stateName];
		};

		this._afterCurrentStateExit = function(newStateName, err) {
			if(err) throw err;
			var self = this,
				newState = self._states[newStateName];
			self._currentStateName = newStateName;
			newState.enter && newState.enter();
		};

	};

	S.module('states', withStates);

}());