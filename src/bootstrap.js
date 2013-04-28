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



}());