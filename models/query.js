var request = require('request').defaults({jar:true});
var cheerio = require('cheerio');

function Query (obj) {
	this.weburl       = obj.weburl;	//http://www.pixiv.net/member_illust.php?id=xxxxxxx
	this.author		  = obj.author;
	this.proxy        = obj.proxy;
	this.cookies      = obj.cookies;
	this.headers      = obj.headers;
	this.picList      = [];
	this.multipleList = [];
}

Query.prototype.getPicList = function (callback) {
	var that = this;
	request({
		url: that.weburl || 'http://www.pixiv.net/member_illust.php?id=' + that.author,
		proxy: that.proxy,
		headers: that.headers,
		jar: that.cookies
	},function (err, res, body){
		if (err) {
			return callback(err);
		}
		var $ = cheerio.load(body);
		$('a._work').each(function () {
			var img = $(this).find('img');
			var item = {
				src: img.attr('src'),
				id : img.attr('src').replace('_p0_master1200.jpg','').split('/').slice(-1)
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
			that.weburl = that.weburl.split('?')[0] + nextpage;
			console.log('that.weburl : ' + that.weburl);				//console.log
			that.getPicList(callback);
		} else {
			that.multipleToPic(callback);
		}
	});
}
Query.prototype.multipleToPic = function (callback) {
	var that = this;

	//带cookie访问获取图片列表
	var length = that.multipleList.length;
	that.multipleList.forEach(function (multiple, index) {
		var id = multiple.src.replace('_p0_master1200.jpg','').split('/').slice(-1);
		var url= 'http://www.pixiv.net/member_illust.php?mode=manga&illust_id=' + id;

		request({
			uri: url,
			headers: that.headers,
			jar: that.cookies
		},function (err, res, body){
			if (err) {
				return callback(err);
			}
			var $ = cheerio.load(body);
			$('div.item-container').each(function (index) {
				var item 	= {
					src: multiple.src.replace('_p0','_p' + index),
					id : id + '_p' + index
				};
				if (item.src) {
					that.picList.push(item);
				}
			});
			if (index == length - 1) {
				callback(null);
			}
		});
	});
}

module.exports = Query;