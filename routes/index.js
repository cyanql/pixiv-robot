var express = require('express');
var router = express.Router();
var Search = require('../models/search.js');

var search = null;

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index');
});

router.post('/', function (req, res, next) {
	search = new Search({
		url: 'http://www.pixiv.net/member_illust.php?id=795196',
		author: '',
		downloadpath : 'public/images/',
		username: req.body.user,//'icarusves@gmail.com',
		password: req.body.pass//'michael1123'

	});
	search.previewPic(function (err) {
		if (err) {
			return console.error(err);
		}
		console.log('go to thumbnail');
		res.redirect('/thumbnail');
	});
});

router.get('/thumbnail', function (req, res, next) {
	if (search == null) {
		res.redirect('/');
		return console.log('err');
	}
	res.render('thumbnail', { 
		picList : search.picList,
		cachepath : search.cachepath
	});
});
router.post('/thumbnail', function (req, res, next) {
	var ipicList = search.picList;
	var jpicList = JSON.parse(req.body.picList);
	var ilength  = ipicList.length;
	var jlength  = jpicList.length;
	var picList  = [];

	for (var i = 0; i < ilength; i++) {
		for (var j = 0; j < jlength; j++) {
			if(ipicList[i].number == jpicList[j].number) {
				picList.push(ipicList[i]);
			}
		}
	}

	search.downloadPic(picList, function (err) {
		res.json({success : 1});
	})
});
module.exports = router;
