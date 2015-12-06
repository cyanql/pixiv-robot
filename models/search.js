var request = require('request').defaults({jar:true});
var cheerio = require('cheerio');
var debug = require('debug');
var qs = require('querystring');
var fs = require('fs');
var Mkdirs = require('./mkdirs');

debug('loading picture');

function Search (object) {
	this.uri          = object.url;	//http://www.pixiv.net/member_illust.php?id=xxxxxxx
	this.author       = object.author !== '' ? object.author : object.url.match(/\d+/g) + '';
	this.downloadpath = object.downloadpath;
	this.cachepath    = 'images/cache/';
	this.username     = object.username;
	this.password     = object.password;
	this.proxy        = '';
	this.cookies      = null;
	this.picList      = [];
	this.multipleList = [];
	this.headers      = {
			'Referer':'http://www.pixiv.net',
			'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
		};
}

Search.prototype.getCookie = function (session) {
	var j = request.jar();
	var cookies = request.cookie(session + "");
	j.setCookie(cookies, this.uri);
	this.cookies = j;
}

Search.prototype.login = function (callback) {		//login
	var that = this;

	if (that.cookie) {
		console.log('that.cookie has exised : ' + that.cookie);
	} else {
		request(
			{
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
			}, 
			function (err, res, body) {
				if (err) {
					return callback(err);
				}
				var session = res.headers['set-cookie'];
				var length = session.length;
				if (length > 1) {
					session = session.slice(1);
				}

				console.log(session+"\n");
				that.getCookie(session);
				callback(null);
			}
		);
	}
};

Search.prototype.getPicWeb = function (callback) {
	var that = this;

	//登录获取cookie
	that.login(function (err) {				
		if (err) {
			return callback(err);
		}
		//带cookie访问获取图片列表
		that.urlReq(that.uri, function () {
			callback(null, that.multipleList);
		});
	});
};

Search.prototype.urlReq = function (url, callback) {
	var that = this;
	request({
		//http://www.pixiv.net/member_illust.php?id=xxxxxxx
		uri: that.uri,
		proxy: that.proxy,
		headers: that.headers,
		jar: that.cookies
	},function (err, res, body){
		if (err) {
			return console.error(err);
		}
		var $ = cheerio.load(body);
		$('a._work').each(function () {
			var img = $(this).find('img');
			var item = {
				//http://i2.pixiv.net/c/150x150/img-master/img/2015/04/27/04/29/52/50051305_p0_master1200.jpg
				src: img.attr('src'),
				//50051305
				number : img.attr('src').replace('_p0_master1200.jpg','').split('/').slice(-1)
			};
			if (item.src) {
				if ($(this).hasClass('multiple')) {
					that.multipleList.push(item);
				} else {
					that.picList.push(item);
				}
			}
		});

		var nextpage = $('span.next a').attr('href');
		if (nextpage) {
			that.uri = that.uri.split('?')[0] + nextpage;
			console.log('that.uri : ' + that.uri);				//console.log
			that.urlReq(that.uri, callback);
		} else {
			callback();
		}
	});
}
Search.prototype.multipleToList = function (callback) {
	var that = this;

	that.getPicWeb(function (err, multipleList) {
		if (err) {
			return callback(err);
		}
		//带cookie访问获取图片列表
		var length = multipleList.length;
		var index = 0;
		multipleList.forEach(function (multiple) {
			//50051305
			var picid = multiple.src.replace('_p0_master1200.jpg','').split('/').slice(-1);
			var url= 'http://www.pixiv.net/member_illust.php?mode=manga&illust_id=' + picid;

			console.log(url);
			
			request({
				uri: url,
				headers: that.headers,
				jar: that.cookies
			},function (err, res, body){
				if (err) {
					return callback(err);
				}
				var $ = cheerio.load(body);
				var i = 0;
				$('div.item-container').each(function () {
					var item 	= {
						//http://i2.pixiv.net/c/150x150/img-master/img/2015/04/27/04/29/52/50051305_p0_master1200.jpg
						src: multiple.src.replace('_p0','_p' + i), 	
						//50051305_p0
						number : picid + '_p' + i
					};
					if (item.src) {
						that.picList.push(item);
					}
					i++;
				});
				index++;
				if (index == length) {
					callback(null);
				}
			});
		});	
	});
}

Search.prototype.previewPic = function (callback) {
	var that = this;

	that.multipleToList(function (err) {
		if (err) {
			return callback(err);
		}

		Mkdirs('public/' + that.cachepath, 0777, function (err) {
			if (err) {
				return console.error(err);
			}

			var length = that.picList.length;
			/*that.picList.forEach(function (pic, index) {
				var url = pic.src;
				var picpath = 'public/' + that.cachepath + url.split('/').slice(-1);

				that.picReq(url, picpath, 150 * length + 100 * index, 0);//200*100+500*1 
			});*/
			var url = that.picList[0].src;
			var picpath = 'public/' + that.cachepath + url.split('/').slice(-1);

			that.picReq(that.picList, length, url, picpath, 1000, 0, 0);//200*100+500*1 150 * length + 100 * index
			callback(null);
		});
	});
};


Search.prototype.downloadPic = function (picList, callback) {
	var that = this;
	var downloadpath = that.downloadpath + '' + that.author + '/';

	Mkdirs(downloadpath, 0777, function (err) {
		if (err) {
			return console.error(err);
		}
		var length = picList.length;
		/*picList.forEach(function (pic, index) {
			var url= pic.src.replace('c/150x150/img-master','img-original').replace('_master1200','');
			var picpath = downloadpath + url.split('/').slice(-1);

			that.picReq(picpath, 1000 * length + 500 * index, 0);
		});*/
		var url= picList[0].src.replace('c/150x150/img-master','img-original').replace('_master1200','');
		var picpath = downloadpath + url.split('/').slice(-1);
		that.picReq(picList, length, url, picpath, 3000, 0, 0);
		callback(null);
	});
}
Search.prototype.picReq = function (picList, length, url, picpath, waittime, index, reload_times) {
	var that = this,
		signal,
		finished;

	var id = picpath.split('/').slice(-1);
	var start = Date.now();

	if(reload_times > 2) {
		console.log(id + " has reloaded 5 times")
		return false;
	}
	request({
		uri: url,
		headers: that.headers,
		jar: that.cookies
	}).on('error', function (err) {
		reload_times ++;
		that.picReq(picList, length, url, picpath, waittime, index, reload_times);							/***********************/
		console.log('err -> reloadPic :'+ id);
		return false;
	}).on('response', function (res) {
		if(res && res.statusCode == 404 && url.match(/\.jpg$/)){
			signal = "404";
			fs.unlink(picpath);
			reload_times ++;
			that.picReq(picList, length, url.replace('.jpg','.png'), picpath.replace('.jpg','.png'), 1000, index, reload_times);/***********************/
			return false;
		} else if (res && res.statusCode == 200) {
			signal = "200";
    		setTimeout(function () {
    			console.log(id + " -> waittime : "+ waittime + " -> time : " + (Date.now() - start)/1000);
    			if (finished !== true) {
					reload_times ++;
    				that.picReq(picList, length, url, picpath, waittime, index, reload_times);							/***********************/
					console.log('timeout -> reloadPic :'+ id);
    			}
    		},waittime);
		}
	}).on('end', function () {
    	if (signal == "200" && length) {
    		finished = true;
    		index ++;
    		if (index >= length) {
    			return console.log("over");
    		}
			url= picList[index].src.replace('c/150x150/img-master','img-original').replace('_master1200','');
			picpath = that.downloadpath + '' + that.author + '/' + url.split('/').slice(-1);
    		that.picReq(picList, length, url, picpath, waittime, index, reload_times);				/***********************/
        	console.log('downloadPic finish:'+picpath.split('/').slice(-1));
    	}
    }).pipe(fs.createWriteStream(picpath));
}
/*
Search.prototype.picReq = function (url, picpath, waittime, reload_times) {
	var that = this,
		signal,
		finished;

	var id = picpath.split('/').slice(-1);
	var start = Date.now();

	if(reload_times > 2) {
		console.log(id + " has reloaded 5 times")
		return false;
	}
	request({
		uri: url,
		headers: that.headers,
		jar: that.cookies
	}).on('error', function (err) {
		if (err) {
			reload_times ++;
			that.picReq(url, picpath, waittime);
			console.log('err -> reloadPic :'+ id);
			return false;
		}
	}).on('response', function (res) {
		if(res && res.statusCode == 404 && url.match(/\.jpg$/)){
			signal = "404";
			fs.unlink(picpath);
			reload_times ++;
			that.picReq(url.replace('.jpg','.png'), picpath.replace('.jpg','.png'), 1000, reload_times);
			return false;
		} else if (res && res.statusCode == 200) {
			signal = "200";
    		setTimeout(function () {
    			console.log(id + " -> waittime : "+ waittime + " -> time : " + (Date.now() - start)/1000);
    			if (finished !== true) {
					reload_times ++;
    				that.picReq(url, picpath, waittime, reload_times);
					console.log('timeout -> reloadPic :'+ id);
    			}
    		},waittime);
		}
	}).on('end', function () {
    	if (signal == "200") {
    		finished = true;
        	console.log('downloadPic finish:'+picpath.split('/').slice(-1));
    	}
    }).pipe(fs.createWriteStream(picpath));
}
*/
module.exports = Search;
