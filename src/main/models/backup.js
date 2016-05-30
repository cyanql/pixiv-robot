import UserInfo from 'renderer/models/UserInfo'
import Pixiv from 'renderer/models/Pixiv'
import Picture from 'renderer/models/Picture'
import fs from 'fs-extra-promise'
import ImageSize from 'image-size'
import path from 'path'

const pixiv = new Pixiv()
const userinfo = new UserInfo({
	username: '',
	password: '',
	cookie: '',
	proxy: '',
	downloadPath: ''
})
userinfo.loadFromLocal()

export const existsCookie = () => {
	//读取cookie
	return !!userinfo.get('cookie')
}
//由electron直接抓取页面替代
/*
export const loginAsync = async (info) => {
	//用户登录
	try {
		const res = await pixiv.loginAsync(info)
		//获取cookie，并检验(密码)
		const cookie = res.headers.getAll('set-cookie').find(v => /PHPSESSID=\d+_[a-z0-9]+/.test(v))
		if (!cookie)
			return false
		//写入cookie
		userinfo.update('cookie', cookie)
		userinfo.saveToLocal()

		return true
	} catch (err) {
		console.error(err)
		return false
	}
}
*/

export const setOption = (option) => {
	const keys = Object.keys(option)
	for (const key of keys) {
		userinfo.update(key, option[key])
	}
	userinfo.saveToLocal()
}

export const downloadThumbListAsync = async (authorId) => {
	const option = {
		authorId,
		proxy: userinfo.get('proxy'),
		headers: {
			cookie: userinfo.get('cookie')
		}
	}

console.log(option, 'option')
	//解析页面，并查询图片元素
	await pixiv.queryPictureAsync(option)

	//获取缩略图片列表
	const thumbnailList = await pixiv.get('picList')
	//创建下载路径，并下载
	const thumbnailPath = path.join(userinfo.get('cachePath'), authorId, 'thumbnail')
	downloadAsync(thumbnailList, {
		...option,
		path: thumbnailPath
	})
	return thumbnailList
}

export const downloadPicListAsync= async (authorId, picList) => {
	const option = {
		authorId,
		proxy: userinfo.get('proxy'),
		headers: {
			cookie: userinfo.get('cookie')
		}
	}
	//将缩略图源替换为原始图源
	const originalPicList = mapReplaceSrc(picList)
	//创建下载路径，并下载
	const originalPicPath = path.join(userinfo.get('downloadPath'), authorId)
	downloadAsync(originalPicList, {
		...option,
		path: originalPicPath
	})
	return originalPicList
}



function mapReplaceSrc(picList) {
	return picList.map((v) => {
		//循环1000000次，直接替换约为0.26s-0.32s,正则替换约为0.18s~0.2s
		//v.src.replace('c/150x150/img-master','img-original').replace('_master1200','')
		v.src = v.src.replace(/c.*img-master/, 'img-original').replace(/(_p\d+)_.*(\..*)$/, '$1$2')
		return v
	})
}

async function downloadAsync(picList, option) {
	const arr = []

	//异步请求， 同步下载
	for (let v of picList) {
		const pic = new Picture({
			src: v.src,
			name: v.src.match(/[^\/]*$/).toString()
		})
		pic.onProgress = v.onProgress
		pic.onFinished = v.onFinished
		pic.onNotFound = ()	=> {
			if (pic._src.match(/\.jpg$/)) {
				pic._src = pic._src.replace(/\.jpg$/, '.png')
				pic._name = pic._name.replace(/\.jpg$/, '.png')
				arr.push(pic.downloadAsync(option))
			} else {
				v.onNotFound()
			}
		}
		arr.push(pic.downloadAsync(option))
	}
	for (let v of arr) {
		await v
	}
	//	同步请求 & 下载
	//
	//	for (let v of picList) {
	//		const pic = new Picture({...option, ...v})
	//		await pic.downloadAsync(pathname)
	//	}
	//
}

export const getPicListFromCacheAsync = async (authorId) => {

	const thumbnailPath = path.join(userinfo.get('cachePath'), authorId, 'thumbnail')

	if (!await fs.existsAsync(thumbnailPath)) return []

	const filenames = await fs.readdirAsync(thumbnailPath)
	return filenames.map(filename => ImageSize(thumbnailPath, filename))
}


export const getPictureFromCacheAsync = async (authorId, filename) => {
	const thumbnailPath = path.join(userinfo.get('cachePath'), authorId, 'thumbnail')

	if (!await fs.existsAsync(thumbnailPath)) return

	return ImageSize(thumbnailPath, filename)
}
/*
	const thumbnailPath = path.join(option.cachePath, authorId, 'thumbnail')

	const root = document.getElementById('root')
	fs.readdirAsync(thumbnailPath, (err, filenames) => {
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
