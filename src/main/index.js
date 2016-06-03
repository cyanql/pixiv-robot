import { ipcMain } from 'electron'
import UserInfo from './models/UserInfo'
import Pixiv from './models/Pixiv'
import Picture from './models/Picture'
import fs from 'fs-extra-promise'
import ImageSize from 'image-size'
import path from 'path'


/**
 * 可解析pixiv网页
 */
const pixiv = new Pixiv()
/**
 * 用户信息管理
 */
const userinfo = new UserInfo({
	username: '',
	password: '',
	cookie: '',
	proxy: '',
	downloadPath: ''
})
/**
 * 从本地读取信息并装载
 */
userinfo.loadFromLocal()


/**
 * 检查cookie是否存在
 * @param  {[string]} 'checkCookie-m' 监听事件
 * @param  {[function]} (e)            回调（渲染线程事件）
 * @return {[boolean]}                 cookie是否存在
 */
ipcMain.on('checkCookie-m', (e) => {
	const exists = !!userinfo.get('cookie')
	e.sender.send('checkCookie-r', exists)
})


/**
 * 登录
 * @param  {[string]} 'login-m' 监听事件
 * @param  {[function]} (e, info)	回调（渲染线程事件，登录信息）
 * @return {[boolean]}                登录是否成功
 */
ipcMain.on('login-m', async (e, info) => {
	//用户登录
	try {
		const res = await pixiv.loginAsync(info)
		//获取cookie，并检验(密码)
		const cookie = res.headers.getAll('set-cookie').find(v => /PHPSESSID=\d+_[a-z0-9]+/.test(v))
		console.log('cookie', cookie)``
		if (!cookie)
			return e.sender.send('login-r', false)
		//写入cookie
		userinfo.update('cookie', cookie)
		userinfo.saveToLocal()

		e.sender.send('login-r', true)
	} catch (err) {
		console.error(`login-m-${err}`)
		e.sender.send('login-r', false)
	}
})

/**
 * 设置userinfo并缓存到本地
 * @param  {[string]} 'setOption-m' 监听事件
 * @param  {[function]} (e, option)   回调(渲染线程事件, 配置选项)
 */
ipcMain.on('setOption-m', (e, option) => {
	console.log(Object.keys(option))
	Object.keys(option).forEach(key => {
		userinfo.update(key, option[key])
	})
	userinfo.saveToLocal()
})


/**
 * 本地获取图片列表
 * @param  {[string]} 'getPicListFromCache-m' 事件名
 * @param  {[function]} (e, authorId) 				(事件对象 用户id)
 * @return {[object array]}                		  缓存素略图图片列表
 */
ipcMain.on('getThumbListFromCache-m', async (e, authorId) => {
	const thumbnailPath = path.join(userinfo.get('cachePath'), authorId, 'thumbnail.json')

	console.log(await fs.existsAsync(thumbnailPath))
	if (!await fs.existsAsync(thumbnailPath)) {
		e.sender.send('getThumbListFromCache-r', [])
	} else {
		const picList = fs.readJsonSync(thumbnailPath)
		e.sender.send('getThumbListFromCache-r', picList)
		/*	缓存文件夹中获取本地图片
		const filenames = await fs.readdirAsync(thumbnailPath)
		const picList = filenames.map(filename => getPictureFromLocal(thumbnailPath, filename))
		*/
	}
})

/**
 * 网络查找缩略图
 * @param  {[string]} 'getThumbListFromNet-m' 时间名
 * @param  {[function]} (e, authorId) 		(事件对象 用户id)
 * @return {[type]}    						缩略图列表
 */
ipcMain.on('getThumbListFromNet-m', async (e, authorId) => {
	const option = {
		authorId,
		proxy: userinfo.get('proxy'),
		headers: {
			cookie: userinfo.get('cookie'),
			referer: Pixiv.HOST
		}
	}

	//解析页面，并查询图片元素
	await pixiv.queryPictureAsync(option)

	//创建下载路径，并下载
	const thumbnailPath = path.join(userinfo.get('cachePath'), authorId, 'thumbnail.json')

	//获取缩略图片列表
	const thumbnailList = pixiv.get('picList')
	fs.outputJsonSync(thumbnailPath, thumbnailList)
	e.sender.send('getThumbListFromNet-r', thumbnailList)
	/*  下载图片列表，并通知渲染线程
	downloadAsync(thumbnailList, {
		...option,
		path: thumbnailPath
	}, e.sender)
	*/
})

/**
 * 下载选取的图片
 * @param  {[string]} 'downloadPicList-m' 事件名
 * @param  {[function]} (e, authorId, picList) 	（事件对象，作者id，需要下载的图片
 */
ipcMain.on('downloadPicList-m', (e, authorId, picList) => {
	const option = {
		authorId,
		proxy: userinfo.get('proxy'),
		headers: {
			cookie: userinfo.get('cookie'),
			referer: Pixiv.HOST
		}
	}
	//将缩略图源替换为原始图源
	const originalPicList = mapThumbnailToOriginal(picList)
	//创建下载路径，并下载
	const originalPicPath = path.join(userinfo.get('downloadPath'), authorId)
	downloadAsync(originalPicList, {
		...option,
		path: originalPicPath
	}, e.sender)
})

/**
 * 从本地读取单张图片
 * @param  {[string]} pathname 路径名称（不包含文件名）
 * @param  {[string]} filename 文件名称
 * @return {[Object]}
 * {
 * 		name,
 * 		localSrc,
 * 		width,
 * 		height
 * }
 */
function getPictureFromLocal(pathname, filename) {
	const localSrc = path.join(pathname, filename)
	return Object.assign({
		name: filename,
		localSrc
	}, ImageSize(localSrc))
}

/**
 * 将缓存图地址转为原始图地址
 * @param  {[object array]} picList 缓存图数组
 * @return {[object array]}         原始图数组
 */
function mapThumbnailToOriginal(picList) {
	return picList.map(v => {
		//循环1000000次，直接替换约为0.26s-0.32s,正则替换约为0.18s~0.2s
		//v.src.replace('c/150x150/img-master','img-original').replace('_master1200','')
		v.src = v.src.replace(/c.*img-master/, 'img-original').replace(/(_p\d+)_.*(\..*)$/, '$1$2')
		return v
	})
}


/**
 * 下载图片
 * @param  {[object array]} picList 需要下载的图片数组
 * @param  {[object]} option  现在需要的配置
 * {
 *   headers: { referer, cookie },
 *   proxy,
 *   path
 * }
 * @param  {[object]} sender  消息发送器 -> ipcRenderer
 * @return {[object]}
 * {
 * 		name,
 * 		localSrc,
 * 		width,
 * 		height
 * }
 */
async function downloadAsync(picList, option, sender) {

	//异步请求， 同步下载
	const newPicList = picList.map(v => {
		const pic = new Picture({
			src: v.src,
			name: v.src.match(/[^\/]*$/).toString()
		})
		const picJS = pic.toJS()
		picJS.index = v.index
		pic.onProgress = (progree) => sender.send('download-progress-r', picJS, progree)
		pic.onFinished = () => {
			sender.send('download-finished-r', picJS)
		}
		pic.downloadAsync(option)
		return pic
	})

	for (const v of newPicList) {
		await v;
	}
	//	同步请求 & 下载
	//
	//	for (let v of picList) {
	//		const pic = new Picture({...option, ...v})
	//		await pic.downloadAsync(pathname)
	//	}
	//
}
