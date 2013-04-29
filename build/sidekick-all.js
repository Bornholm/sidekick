(function() {

	var S = this.Sidekick = this.Sidekick || {};


	/** Module Utils **/

	/** Check if a given Entity has already been extended by a given module **/
	S.has = function(moduleMark, entity) {
		var i, len, curr,
			marks = entity._modulesMarks;
		if(marks) {
			for(i = 0, len = marks.length; i < len; ++i) {
				curr = marks[i];
				if(curr === moduleMark) return true;
			}
		}
		return false;
	};

	/** "Mark" an given entity as extended by the given module **/
	S._mark = function(moduleMark, entity) {
		var marks = entity._modulesMarks = entity._modulesMarks || [];
		marks.push(moduleMark);
	};


	/** Events Binding **/

	S.bindEvent = function bindEvent(element, type, handler) {
	   if(element.addEventListener) {
	      element.addEventListener(type, handler, false);
	   }else{
	      element.attachEvent('on'+type, handler);
	   }
	};



}());(function() {

	var S = this.Sidekick = this.Sidekick || {},
		modules = {};

	S.module = function(name, module) {
		if(arguments.length === 1) {
			return modules[name]
		} else if(arguments.length === 2) {
			modules[name] = module;
		}
	};

}());(function() {

	var S = this.Sidekick = this.Sidekick || {};


	var extend = function(src, dest) {
			var key;
			for (key in src) {
				dest[key] = src[key];
			}
		},
		getEntity = function() {
			return function Entity() {
				this.initialize.apply(this, arguments);
			};
		};
	
	S.entity = function(src, modules) {

		modules = modules || [];

		var i, len, module,
			e = getEntity();
			p = e.prototype;

		extend(src, p);

		S.module('entity').call(p);

		for(i = 0, len = modules.length; i < len; ++i) {
			module = S.module(modules[i]);
			if(module) {
				module.call(p);
			} else throw new Error('Module "'+modules[i]+'" is undefined !');
		}

		return e;
	};

}());(function() {

	var S = this.Sidekick = this.Sidekick || {};

	var push = Array.prototype.push,
		noop = function() {};

	var withHelpers = function() {

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

		S._mark('helpers', this);

	};

	S.module('helpers', withHelpers)

}());(function() {

	var S = this.Sidekick = this.Sidekick || {};

	var withEntity = function() {

		!S.has('helpers', this) && S.module('helpers').call(this)

		S._mark('entity', this);

		!this.initialize && (this.initialize = function() {});

	};

	S.module('entity', withEntity);

}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	var withGame = function() {

		!S.has('entity', this) && S.module('entity').call(this)
		
		S._mark('game', this);

		this.before('initialize', function() {
			this._entities = [];
			this._onAnimationFrameBinded = this._onAnimationFrame.bind(this);
		});

		this._resetClock = function() {
			this._clock = {
				t: 0,
				lastCall: this.now(),
				accumulator: 0
			};
		};

		this.getInterval = function() {
			return (1000/this._fps)|0;
		};

		this.setInterval = function(interval) {
			this._fps = (1000/interval)|0;
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
			entity.onEntityAdd && entity.onEntityAdd(this);
		};

		this.removeEntity = function(entity) {
			var i, len, curr,
				entities = this._entities;
			for(i = 0, len = entities.length; i < len; ++i) {
				if(entities[i] === entity) {
					entity.onEntityRemove && entity.onEntityRemove(this);
					entities.splice(i, 1);
					return;
				}
			}
		};

		this.update = function(time, deltaTime) {
			var i, len,
				entities = this._entities;
			for(i = 0, len = entities.length; i < len; ++i) {
				entities[i].update && entities[i].update(time, deltaTime);
			}
		};

		this.render = function(interpolation) {
			var i, len,
				entities = this._entities;
			for(i = 0, len = entities.length; i < len; ++i) {
				entities[i].render && entities[i].render(interpolation);
			}
		};

		this.start = function() {
			this._resetClock();
			this._rafId = window.requestAnimationFrame(this._onAnimationFrameBinded);
		};

		this._onAnimationFrame = function() {
			this.run();
			window.requestAnimationFrame(this._onAnimationFrameBinded);
		}

		this.stop = function() {
			window.cancelAnimationFrame(this._rafId);
		};

		this.now = (function() {
			var performance = window.performance;
			if(performance && performance.now) {
				return performance.now.bind(performance);
			} else {
				return Date.now
			}
		}());

		this.run = function() {
			
			var alpha,
				self = this,
				clock = self._clock,
				interval = self.getInterval(),
				delta = this.now() - clock.lastCall;

			clock.lastCall = this.now();
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

	S.module('game', withGame);

}());(function() {

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

		this.getStates = function() {
			return this._states;
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

}());(function() {

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

	var withStats = function() {

		!S.has('game', this) && S.module('game').call(this)

		S._mark('stats', this);

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

	S.module('stats', withStats);


}());(function() {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        x,
        length,
        currTime,
        timeToCall;

    for(x = 0, length = vendors.length; x < length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            currTime = new Date().getTime();
            timeToCall = Math.max(0, 16 - (currTime - lastTime));
            lastTime = currTime + timeToCall;
            return window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};

	var withCreateJsEntity = function() {

		!S.has('entity', this) && S.module('entity').call(this);

		S._mark('createjs:entity', this);

		!this.onEntityAdd && (this.onEntityAdd = function() {});
		!this.onEntityRemove && (this.onEntityRemove = function() {});

	}

	S.module('createjs:entity', withCreateJsEntity);
	
}());(function() {
	
	var S = this.Sidekick = this.Sidekick || {};


	var withCreateJsGame = function() {

		!S.has('game', this) && S.module('game').call(this);

		S._mark('createjs:game', this);

		this.before('initialize', function(canvasOrId) {
			this._stage = new createjs.Stage(canvasOrId)
		});

		this.addChild = function(displayObject) {
			this._stage.addChild(displayObject);
		};

		this.removeChild = function(displayObject) {
			this._stage.removeChild(displayObject);
		};

		this.removeAllChildren = function() {
			this._stage.removeAllChildren();
		};

		this.getWidth = function() {
			return this._stage.canvas.width;
		};

		this.setWidth = function(w) {
			this._stage.canvas.width = w;
		};

		this.getHeight = function() {
			return this._stage.canvas.height;
		};

		this.setHeight = function(h) {
			this._stage.canvas.height = h;
		};


		this.getStage = function() {
			return this._stage;
		}


		this.after('render', function() {
			this._stage.update();
		});

	}

	S.module('createjs:game', withCreateJsGame);

}());(function() {
	
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
	
}());(function() {

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