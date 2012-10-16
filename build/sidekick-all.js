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


}());(function() {

	/*The MIT License

	Copyright (c) 2009-2012 Mr.doob

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.*/

	// stats.js - http://github.com/mrdoob/stats.js
	var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
	i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
	k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
	"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:11,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
	a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};
	
	var S = this.Sidekick = this.Sidekick || {};

	S.with = S.with || {};

	var withStats = function() {

		if( !S._require('Game', this) ) {
			S.with.Game.call(this)
		}

		this._mark('Stats');

		this.before('initialize', function() {
			var stats = this._stats = new Stats();
			document.body.appendChild( stats.domElement );
		});

		this.before('render', function() {
			this._stats.begin();
		});

		this.after('render', function() {
			this._stats.end();
		});

	};

	S.with.Stats = withStats;


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