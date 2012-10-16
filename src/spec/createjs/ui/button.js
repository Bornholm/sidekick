(function() {

	var S = this.Sidekick = this.Sidekick || {};

	var wButton = function() {

		!S.has('entity', this) && S.module('entity').call(this);
		!S.has('states', this) && S.module('states').call(this);
		S._mark('createjs:button', this);

	};

	S.module('createjs:button', wButton);

}());