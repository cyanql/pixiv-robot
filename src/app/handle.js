import User from 'app/models/User'
import Collection from 'app/models/Collection'
import Picture from 'app/models/Picture'
import fs from 'app/lib/promise-fs'
import ImageSize from 'image-size'
import path from 'path'

	//配置请求选项
const option = {
	cookie: '',
	authorId: '',
	proxy: '',
	cachePath: path.join(__dirname,'cache'),
	downloadPath: ''
}

export const setOption = (opt) => {
	Object.assign(option, opt)
}

export const login = async (userinfo) => {
	//读取cookie
	let cookiepath = path.join(option.cachePath, 'pixiv_cookie.txt')
	let cookie = await fs.readFile(cookiepath, 'utf8')

	if (!cookie) {
		console.log('login')
		//创建用户
		const user = new User(userinfo)
		//用户登录
		await user.login()
		//获取用户cookie
		cookie = user.getCookie()
		//写入cookie
		fs.writeFile(cookiepath, cookie)
	}

	setOption({cookie})
}


export const downloadThumbnails = async () => {
	//创建作品集
	const collection = new Collection(option)
	//解析页面，并查询图片元素
	await collection.queryPictureAll()


	//获取缩略图片列表
	const thumbnailList = await collection.getPictureList()
	//创建下载路径，并下载
	const thumbnailPath = path.join(option.cachePath, option.authorId, 'thumbnail')
	await download(thumbnailPath, thumbnailList, option)
}

export const downloadPictures= async (picList) => {
	//将缩略图源替换为原始图源
	const originalPicList = mapReplaceSrc(picList)
	//创建下载路径，并下载
	const originalPicPath = path.join(option.downloadPath, option.authorId)
	await download(originalPicPath, originalPicList, option)
}



function mapReplaceSrc(picList) {
	return picList.map((v) => {
		//循环1000000次，直接替换约为0.26s-0.32s,正则替换约为0.18s~0.2s
		//v.src.replace('c/150x150/img-master','img-original').replace('_master1200','')
		v.src = v.src.replace(/c.*img-master/, 'img-original').replace(/(_p\d+)_.*(\..*)$/, '$1$2')
		return v
	})
}

async function download(pathname, picList, option) {
	const arr = []

	await fs.mkdirs(pathname)
	//异步请求， 同步下载
	for (let v of picList) {
		const pic = new Picture({...option, ...v})
		arr.push(pic.download(pathname))
	}
	for (let v of arr) {
		await v
	}
	//	同步请求 & 下载
	//
	//	for (let v of picList) {
	//		const pic = new Picture({...option, ...v})
	//		await pic.download(pathname)
	//	}
	//
}

export function thumbnailToOriginal(picList) {
	return picList.map((v) => {
		//循环1000000次，直接替换约为0.26s-0.32s,正则替换约为0.18s~0.2s
		//v.src.replace('c/150x150/img-master','img-original').replace('_master1200','')
		v.src = v.src.replace(/c.*img-master/, 'img-original').replace(/(_p\d+)_.*(\..*)$/, '$1$2')
		return v
	})
}

export const getPictureSrcFromLocal = async () => {

	const thumbnailPath = path.join(option.cachePath, option.authorId, 'thumbnail')

	const filenames = await fs.readdir(thumbnailPath)

	return filenames.map(filename => ImageSize(thumbnailPath, filename))
}

/*
	const thumbnailPath = path.join(option.cachePath, authorId, 'thumbnail')

	const root = document.getElementById('root')
	fs.readdir(thumbnailPath, (err, filenames) => {
		filenames.forEach((filename) => {
			//创建图片元素
			const img = new Image()
			//转换本地图片存放路径
			const src = path.join(thumbnailPath, filename)
			var thumbnail = ImageSize('cache/354252/thumbnail/' + filename)

			//创建容器元素，并设置宽高
			const div = document.createElement('div')
			div.style.width = thumbnail.width * 200 / thumbnail.height + 'px'
			div.style.flexGrow = thumbnail.width * 200 / thumbnail.height

			//创建容器元素，并设置宽高
			const i = document.createElement('i')
			i.style.paddingBottom = thumbnail.height / thumbnail.width * 100 + '%'
			//加载图片
			img.src = src

			//生成相应元素
			root.appendChild(div)
			div.appendChild(i)
			div.appendChild(img)
		})
	})
 */
