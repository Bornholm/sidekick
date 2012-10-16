(function() {

	var S = this.Sidekick = this.Sidekick || {};

	S.has = function(mark, context) {
		var i, len, curr,
			marks = context._modulesMarks;
		if(marks) {
			for(i = 0, len = marks.length; i < len; ++i) {
				curr = marks[i];
				if(curr === mark) return true;
			}
		}
		return false;
	};

	S._mark = function(mark, obj) {
		var marks = obj._modulesMarks = obj._modulesMarks || [];
		marks.push(mark);
	};

}());