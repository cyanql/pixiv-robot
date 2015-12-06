var fs = require('fs');
var Mkdirs = require('./mkdirs');

function Reload () {
	this.picList = [];
}

Reload.prototype.save = function (pic) {
	that.picList.push(pic);
}
module.exports = Reload;