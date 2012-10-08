var fs = require('fs'),
	uglify = require('uglify-js');

task('default', function() {
	jake.showAllTaskDescriptions();
});

namespace('build', function() {

	var build,
		coreSources = [
			'require',
			'wHelpers',
			'wEntity',
			'wGame',
			'wStateBasedGame'
		],
		createJsSources = [
			'createjs/wCreateJsEntity',
			'createjs/wCreateJsGame'
		];

	build = function(output, sources) {

		jake.mkdirP('build');

		fs.writeFileSync(output, '', 'utf-8');

		sources.forEach(function(f) {
			f = 'src/'+f+'.js';
			var data = fs.readFileSync(f, 'utf-8');
			fs.appendFileSync(output, data, 'utf-8');
		});

	};


	desc('Build all sources');
	task('all', function() {

		var output = 'build/sidekick-all.js',
			sources = coreSources.concat(createJsSources);

		build(output, sources);

	});

	desc('Build createJs sources');
	task('createjs', function() {

		var output = 'build/sidekick-createjs.js',
			sources = coreSources.concat(createJsSources);

		build(output, sources);

	});

});

desc('Create a minified version of the JS files presents in the build folder');
task('minify', function() {

	var files = new jake.FileList(),
		jsp = uglify.parser,
		pro = uglify.uglify;

	files.include('build/*.js');
	files.exclude('build/*min.js');

	files.toArray().forEach(function(f) {

		var ast, outputFile,
			data = fs.readFileSync(f, 'utf-8');

		ast = jsp.parse(data);
		ast = pro.ast_mangle(ast);
		ast = pro.ast_squeeze(ast);

		data = pro.gen_code(ast);

		outputFile = f.slice(0, -3)+'-min.js';

		fs.writeFileSync(outputFile, data, 'utf-8');

	});
});