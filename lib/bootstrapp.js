'use strict';
class BootstrApp {
	constructor(name, window) {
		if(!window) throw new Error('Error loading DOM');
		window.event = require('events').EventEmitter;
		window.JST = {};

		this.name = name;

		// process LESS and apply CSS to document
		this.less(window.less)
		.then(function(css){
			window.$('#stylesheet').html(css);
		})

		// process EJS and load templates in document
		.then(function(){
			return this.ejs(window.ejs);
		}.bind(this))
		.then(function(JST){
			window.JST = JST;
		})

		// takeoff!
		.then(function(templates){
			window.$('#loading').fadeOut();
			window.document.title = name;
			$('body').append(window.JST['hello.ejs']({name: name}));
		});
	}

	// process LESS into CSS
	less(less){
		var less = less || './assets/stylesheets/import.less';

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

	// process .ejs templates into JST functions
	ejs(path, options){
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
};
module.exports = BootstrApp;
