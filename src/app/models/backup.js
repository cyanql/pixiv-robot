import fetch from 'isomorphic-fetch'
import ProxyAgent from 'https-proxy-agent'
import fs from '../lib/promise-fs'
import cheerio from 'cheerio'

export default
class Collection {
	constructor({url, cookie, proxy}) {
		const headers = new Headers()
		headers.set('Cookie', cookie)
		headers.set('Referer', 'http://www.pixiv.net/')

		Object.assign(this, {
			_url: url,
			_headers: headers,
			_proxy: proxy || '',
			_multiplelist: [],
			_piclist: []
		})
	}
	getPictureList() {
		return this._piclist
	}
	async requestHTML(url) {
		let res;
		try {
			res = await fetch(url, {
				headers: this._headers,
				agent: new ProxyAgent(this._proxy)
			})
			return await res.text()
		} catch (err) {
			throw new Error(`请求失败:\n${err}`)
		}
	}
	//查找图片
	async queryPictureAsyncAll() {
		let text
		try {
			text = await this.requestHTML(this._url)
		} catch (err) {
			return console.error(`图片解析:\n${err}`)
		}

		const $ = cheerio.load(text)
		$('a._work').each((idx, elem) => {
			const $img = $(elem).find('img')

			const src = $img.attr('src')
			if (!src) return
			const item = {
				src,
				width: $img.attr('width'),
				height: $img.attr('height')
			}

			if ($(elem).hasClass('multiple'))
				this._multiplelist.push(item)
			else
				this._piclist.push(item)
		})

		//当下一页按钮还存在时继续访问下一页，否则调用multipleToPicture
		const nextpage = $('span.next a').attr('href')
		if (nextpage) {
			this._url = this._url.split('?')[0] + nextpage
			await this.queryPictureAsyncAll()
		} else {
			await this.multipleToPicture()
		}
	}
	async multipleToPicture() {
		//带cookie访问获取图片列表
		for (let v of this._multiplelist) {
			//根据相册id获取相册网址
			const id = String(v.src.match(/[^\/]*$/)).replace(/_p0_.*$/, '')
			const newUrl= `http://www.pixiv.net/member_illust.php?mode=manga&illust_id=${id}`

			let text
			try {
				text = await this.requestHTML(newUrl)
			} catch (err) {
				return console.error(`相册解析:\n${err}`)
			}

			const $ = cheerio.load(text)
			$('div.item-container').each(j => {
				const item = {
					src: v.src.replace('_p0', `_p${j}`),
					width: v.attr('width'),
					height: v.attr('height')
				}
				this._piclist.push(item)
			})
		}
	}
}
/*
(async function() {
	const config = {
		url: 'http://www.pixiv.net/member_illust.php?id=45438',
		proxy: 'http://127.0.0.1:8787',
		authorId: '',
		outpath: '/downloadAsync'
	}
	console.log('begin')
	const collection = new Collection({...config, cookie: 'PHPSESSID=10419852_c6f2fe646ddfd1679be413d8b4e40f19'})
	await collection.queryPictureAsyncAll()
	const piclist = collection.getPictureList()
	console.log(JSON.stringify(piclist))
	try {
		fs.writeFile('./log/piclist.json', JSON.stringify(piclist), {flag: 'a'})
	} catch (err) {
		console.error(`图片数据文件写入错误:\n${err}`)
	}
	console.log('end')
})()
*/
