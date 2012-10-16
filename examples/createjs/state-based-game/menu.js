(function() {

	var MenuState = {

		enter: function() {
			debugger;
			this.context.clearEntities();
		},

		exit: function() {

		}

	};

	Sidekick.with.Entity.call(MenuState);

	this.StateBasedGame.MenuState = MenuState;

}());