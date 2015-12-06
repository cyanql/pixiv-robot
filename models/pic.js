var request = require('request').defaults({jar:true});
var fs = require('fs');
var Mkdirs = require('./mkdirs');
var Reload = require('./reload');

function Pic () {};

Pic.picListToPic = function (picList, config, callback) {
	Mkdirs(config.path, 0777, function (err) {
		if (err) return callback(err);
		picList.forEach(function (eachpic) {
			var pic = {
				src      : eachpic.src,
				id       : eachpic.id,
				reload   : 0,
				finished : false
			};
			Download(pic, config);
		});
		callback();
	});
};


function Download (pic, config) {
	var signal;

	var start = Date.now();

	if(pic.reload > 2) {
		console.log(pic.id + " has reloaded 3 times")
		return false;
	}
	request({
		url: pic.src,
		headers: config.headers,
		jar: config.cookie
	}).on('error', function (err) {
		pic.reload ++;
		Download(pic, config);							/***********************/
		console.log('err -> reloadPic :'+ pic.id);
		return false;
	}).on('response', function (res) {
		if(res && res.statusCode == 404 && pic.src.match(/\.jpg$/)){
			pic.reload ++;
			signal   = "404";
			pic.src = pic.src.replace('.jpg','.png');
			Download(pic, config);
			return false;
		} else if (res && res.statusCode == 200) {
			signal = "200";
    		/*setTimeout(function () {
    			console.log(pic.id + " -> config.waittime : "+ config.waittime + " -> time : " + (Date.now() - start)/1000);
    			if (finished !== true) {
    				 newReload.save(pic);
					 pic.reload ++;
    				 Download(src, config.path, config.waittime, pic.reload);
					 console.log('timeout -> reloadPic :'+ pic.id);
    			}
    		}, config.waittime);*/
		}
	}).on('end', function () {
    	if (signal == "200") {
    		pic.finished = true;
        	console.log(config.path + ' -> downloadPic finish:' + pic.id);
    	}
    }).pipe(fs.createWriteStream(config.path + pic.src.split('/').slice(-1)));
}

module.exports = Pic;