(function() {

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
			if(!state) throw new Error('Cannot add '+state+' as a state !');
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
					currentState = this._states[this._currentStateName];
					if(currentState) {
						currentState.exit && currentState.exit( self._afterCurrentStateExit.bind(self, newStateName) );
					} else {
						self._afterCurrentStateExit(newStateName);
					}
				}
			} else {
				throw new Error('Unknown state '+newStateName+' !');
			}
		};

		this._afterCurrentStateExit = function(newStateName, err) {
			if(err) throw err;
			var self = this,
				newState = self._states[newStateName];
			self._currentStateName = newStateName;
			newState.enter && newState.enter();
		};

	};

	S.with.StateBasedEntity = withStateBasedEntity;


}());