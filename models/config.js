var request = require('request').defaults({jar:true});

function Config (obj) {
	this.path    = obj.path || 'download/';
	this.waittime     =	obj.waittime || 3000;
	this.cookie       = "";
}

Config.prototype.setCookie = function (session, url) {
	var j = request.jar();
	var cookies = request.cookie(session + "");
	j.setCookie(cookies, url);
	this.cookie = j;
}

Config.prototype.headers = {
	'Referer'    : 'http://www.pixiv.net',
	'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
};

module.exports = Config;