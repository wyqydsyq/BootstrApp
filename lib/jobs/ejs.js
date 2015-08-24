// process .ejs templates into JST functions
module.exports = function(path, options){
	var path = path || 'assets/templates/',
		options = options || {};

	// find ejs
	return new Promise(function(a, r){
		fs.listAll(path, {
			recursive: true,
			filter: function(file){
				return !!(file.match(/\.ejs$/));
			}
		}, function(e, files){
			if(!e) return a(files);
			return r(e);
		})
	})

	// process ejs
	.then(function(files){
		var tmp = [];
		files.forEach(function(file){
			tmp.push(
				new Promise(function(a, r){
					var template = file;
					fs.readFile(path + template, function(e, data){
						if(!e) return a({
							file: template,
							data: data.toString()
						});
						return r(e);
					});
				})
			);
		});

		return Promise.all(tmp).then(function(templates){
			var JST = {};
			templates.forEach(function(template){
				JST[template.file] = _.template(template.data, options);
			});
			return JST;
		});
	});
}
