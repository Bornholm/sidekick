(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	var withCreateJs2D = function() {

		!S.has('createjs:entity', this) && S.module('createjs:entity').call(this);

		S._mark('createjs:2d', this);

		!this.onEntityAdd && (this.onEntityAdd = function() {});
		!this.onEntityRemove && (this.onEntityRemove = function() {});

		this.x = 0;
		this.y = 0;

		this.after('initialize', function() {
			this.displayObject = this.displayObject || new createjs.DisplayObject();
		});

		this.after('onEntityAdd', function(game) {
			game.addChild(this.displayObject);
		});

		this.after('onEntityRemove', function(game) {
			game.removeChild(this.displayObject);
		});

		if(!this.render) {
			this.render = function(alpha) {
				this.displayObject.x = this.x;
				this.displayObject.y = this.y;
			}
		}

	}

	S.module('createjs:2d', withCreateJs2D);
	
}());