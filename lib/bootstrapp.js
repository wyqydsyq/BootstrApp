'use strict';
class BootstrApp extends EventEmitter {
	constructor(name, window) {
		super();

		if(!window) throw new Error('Error loading DOM');

		this.name = name;
		this.less = require('./jobs/less');
		this.ejs = require('./jobs/ejs');

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
			this.emit('ready');
		}.bind(this));
	}
};
module.exports = BootstrApp;
