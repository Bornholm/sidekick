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

}());