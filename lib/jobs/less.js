// process LESS into CSS
module.exports = function(less){
	var less = less || 'assets/stylesheets/import.less';

	// load styles
	return new Promise(function(a, r){
		fs.readFile(less, function(e, data){
			if(!e) return a(data);
			return r(e);
		});
	})

	// process styles
	.then(function(less){
		return new Promise(function(a, r){
			return require('less').render(less.toString(), {
				paths: ['.', './assets/stylesheets'],
				filename: 'import.less'
			}, function(e, output){
				if(!e) return a(output.css);
				return r(e);
			});
		});
	});
}
