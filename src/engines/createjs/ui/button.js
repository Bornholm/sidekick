(function() {

	var S = this.Sidekick = this.Sidekick || {};

	var wButton = function() {


		this.wrap('initialize', function(sup) {

			this.addState('normal');
			this.addState('hover');
			this.addState('active');
			this.addState('disabled');	

			sup.apply(this, arguments);

			this.configureMouseHandlers();
			this.setState('normal');

		});

		this.after('onEntityAdd', function(game) {
			game.getStage().enableMouseOver();
		});

		this.configureMouseHandlers = function() {

			var dO = this.displayObject,
				self = this,
				onMouseUp = function() { if(self.getCurrentStateName() !== 'normal') self.setState('hover') },
				backToNormal = function() { self.setState('normal'); };
				
			if(!dO) throw new Error('createjs:button must have a displayObject property !');


			dO.onMouseOver = function() { self.setState('hover') };

			dO.onPress = function() {
				self.setState('active');
			};

			dO.onMouseOut = backToNormal;

			dO.onPress = function(evt) {
				self.setState('active');
				evt.onMouseUp = onMouseUp;
			};

		};

		this.onClick = function(cb) {
			this.displayObject.onClick = cb;
		};

		this.onDoubleClick = function(cb) {
			this.displayObject.onDoubleClick = cb;
		};	

		!S.has('createjs:entity', this) && S.module('createjs:entity').call(this);
		!S.has('states', this) && S.module('states').call(this);	
		S._mark('createjs:button', this);

	};

	S.module('createjs:button', wButton);

}());