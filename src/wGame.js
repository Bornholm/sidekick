(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withGame = function() {

		S.with.Helpers.call(this);

		this.before('initialize', function() {
			this._entities = [];
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

		this.update = function(deltaTime) {
			var i, len, curr,
				entities = this._entities;
			for(i = 0, len = entities.length; i < len; ++i) {
				curr = entities[i];
				curr.isActive && curr.update(deltaTime);
			}
		};

		this.render = function(deltaTime) {
			var i, len, curr,
				entities = this._entities;
			for(i = 0, len = entities.length; i < len; ++i) {
				curr = entities[i];
				curr.isVisible && curr.render(deltaTime);
			}
		};

	};

	S.with.Game = withGame;

}());