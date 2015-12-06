var request = require('request').defaults({jar:true});

function User (object) {
	this.username = object.username;
	this.password = object.password;
	this.proxy = object.proxy;
	this.cookie = null;
}

User.prototype.login = function (callback) {		//login
	var that = this;

	request({
		url: 'https://www.secure.pixiv.net/login.php/',
		method: 'POST',
		proxy: that.proxy,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'text/html, application/xhtml+xml, */*',
			'Accept-Language': 'zh-CN',
			'Cache-Control': 'no-cache',
			'Connection': 'Keep-Alive',
			'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
		},
		form : {
			mode: 'login',
			pixiv_id: that.username,//'icarusves@gmail.com',
			pass: that.password,//'michael1123',
			skip: 1
		}
	}, function (err, res, body) {
		if (err) {
			return callback(err);
		}
		var session = res.headers['set-cookie'];
		var length = session.length;
		if (length > 1) {
			session = session.slice(1);
		}

		console.log(session+"\n");
		that.cookie = session;
		callback(null);
	});
};

module.exports = User;