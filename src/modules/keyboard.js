(function() {

	var S = this.Sidekick = this.Sidekick || {};

	var keys = {};

	S.bindEvent(document, 'keydown', function(evt) {
		var code = evt.key || evt.keyCode;
			keyData = keys[code] = keys[code] || {};
		keyData.down = true;
		keyData.timestamp = Date.now();
	});

	S.bindEvent(document, 'keyup', function(evt) {
		var code = evt.key || evt.keyCode;
			keyData = keys[code] = keys[code] || {};
		keyData.down = false;
		keyData.timestamp = null;
	});

	var withKeyboard = function() {

		!S.has('entity', this) && S.module('entity').call(this)
		S._mark('keyboard', this);

		this.isKeyDown = function(keyCode, withCtrl, withAlt) {
			var key = keys[keyCode];
			return key ? 
				key.down && (withCtrl ? withCtrl : true) && (withAlt ? withAlt : true) : false;
		};

		this.keyDownSince = function(keyCode) {
			return keys[keyCode] ? keys[keyCode].timestamp : false;
		};
		
	};

	S.module('keyboard', withKeyboard);

}());