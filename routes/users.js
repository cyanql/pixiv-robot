var express = require('express');
var router  = express.Router();
var User    = require('../models/user');
var Query   = require('../models/query');
var Config  = require('../models/config');
var Reload  = require('../models/reload');
var Pic     = require('../models/pic');
var Mkdirs  = require('../models/mkdirs');

var newUser   = null,
	newQuery  = null,
	newConfig = null;

/**
 * 登录获取pixiv用户cookie
 * @param  {newUser}    新建一个用户
 * @param  {newUser.login}   登录获取cookie
 */
router.get('/', function (req, res, next) {
	res.render('index');
});

router.post('/', function (req, res, next) {
	newUser = new User({
		username : req.body.user,//'icarusves@gmail.com',
		password : req.body.pass,//'michael1123'
		proxy : req.body.proxy
	});
	newUser.login(function (err) {
		if (err) return console.error(err);
		res.redirect('/config');
	});
});

/**
 * 配置搜索->缩略图下载
 * @param  {newConfig}   新建一个配置
 * @param  {newQuery}   新建一个搜索
 * @param  {newConfig.setCookie} 将用户cookie设置到目标页面
 * @param  {newQuery.getPicList}      获取目标页面的图片地址并打包成数组
 * @param  {Pic.picListToPic}      读取数组并下载图片
 */
router.get('/config', function (req, res, next) {
	if(!newUser.cookie)	res.redirect('/');
	res.render('config');
});

router.post('/config', function (req, res, next) {
	newConfig = new Config({
		path : req.body.path + 'cache/',
		waittime : req.body.waittime
	});
	req.body.weburl = req.body.weburl || ('http://www.pixiv.net/member_illust.php?id=' + req.body.author);
	newConfig.setCookie(newUser.cookie, req.body.weburl);
	newQuery    = new Query({
		weburl  : req.body.weburl,
		author	: req.body.author,
		proxy   : req.body.proxy,
		cookies : newConfig.cookie,
		headers : newConfig.headers
	});

	newQuery.getPicList(function (err) {
		if (err) return console.error(err);
		Pic.picListToPic(newQuery.picList, newConfig, function (err) {
			if (err) return console.error(err);
			res.redirect('thumbnail');
		})
	});	
});

/**
 * 预览窗口->读取缩略图供用户选择->下载用户选择后的图片
 * @param  {queryPicList} req   搜索后得到的图片地址数组
 * @param  {ejsPicList} res   预览页面经用户筛选后的图片id数组
 * @param  {Pic.picListToPic}      读取数组并下载图片
 */
router.get('/thumbnail', function (req, res, next) {
	if(!newUser.cookie)	res.redirect('/');

	res.render('thumbnail', { 
		picList : newQuery.picList,
		path : 'cache/'
	});
});
router.post('/thumbnail', function (req, res, next) {
	var queryPiclist = newQuery.picList;
	var ejsPiclist   = JSON.parse(req.body.picList);
	var picList      = [];

	queryPiclist.forEach(function (queryPic) {
		ejsPiclist.forEach(function (ejsPic) {
			if(queryPic.id == ejsPic.id) {
				queryPic.src = queryPic.src.replace('c/150x150/img-master','img-original').replace('_master1200','');
				picList.push(queryPic);
			}
		});
	});
	console.log(newConfig.path);
	var author = newQuery.author || newQuery.weburl.match(/\d+/g);
	newConfig.path = newConfig.path.replace('cache', author);

	Pic.picListToPic(picList, newConfig, function (err) {
		if (err) return console.error(err);
		res.json({success : 1});
	})
});

module.exports = router;
