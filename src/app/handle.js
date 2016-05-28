import UserInfo from 'app/models/UserInfo'
import Pixiv from 'app/models/Pixiv'
import Picture from 'app/models/Picture'
import fs from 'fs-promise'
import ImageSize from 'image-size'
import path from 'path'

const userinfo = new UserInfo({
	username: '',
	password: '',
	cookie: '',
	proxy: '',
	downloadPath: ''
})
userinfo.loadFromLocalAsync(path.join())

const pixiv = new Pixiv()

export const loginAsync = async (info) => {
	//读取cookie
	let cookie = userinfo.get('cookie')

	if (!cookie) {
		//用户登录
		try {
			await pixiv.loginAsync({
				method: 'POST',
				mode: 'no-cors',
				redirect: 'manual',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				proxy: info.proxy,
				body: `mode=login&pixiv_id=${info.username}&pass=${info.password}&skip=1`
			})
		} catch (err) {
			console.error(err)
			return false
		}

		//获取cookie
		cookie = pixiv.get('cookie')
		//写入cookie
		userinfo.update('cookie', cookie)
	}
	return true
}

export const setOption = (option) => {
	const keys = Object.keys(option)
	for (const key of keys) {
		userinfo.update(key, option[key])
	}
}

export const downloadThumbnails = async (authorId) => {
	const option = {
		authorId,
		proxy: userinfo.get('proxy'),
		headers: {
			cookie: userinfo.get('cookie')
		}
	}

	//解析页面，并查询图片元素
	await pixiv.queryPictureAsync(option)

	//获取缩略图片列表
	const thumbnailList = await pixiv.get('picList')
	//创建下载路径，并下载
	const thumbnailPath = path.join(userinfo.get('cachePath'), authorId, 'thumbnail')
	await downloadAsync(thumbnailPath, thumbnailList, option)
}

export const downloadPictures= async (authorId, picList) => {
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
	await downloadAsync(originalPicPath, originalPicList, option)
}



function mapReplaceSrc(picList) {
	return picList.map((v) => {
		//循环1000000次，直接替换约为0.26s-0.32s,正则替换约为0.18s~0.2s
		//v.src.replace('c/150x150/img-master','img-original').replace('_master1200','')
		v.src = v.src.replace(/c.*img-master/, 'img-original').replace(/(_p\d+)_.*(\..*)$/, '$1$2')
		return v
	})
}

async function downloadAsync(pathname, picList, option) {
	const arr = []

	await fs.mkdirs(pathname)
	//异步请求， 同步下载
	for (let v of picList) {
		const pic = new Picture({...option, ...v})
		arr.push(pic.downloadAsync(pathname))
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

export const getPictureFromLocal = async () => {

	const thumbnailPath = path.join(userinfo.get('cachePath'), userinfo.get('authorId'), 'thumbnail')

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
