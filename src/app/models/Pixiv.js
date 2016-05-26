import fetch from 'isomorphic-fetch'
import ProxyAgent from 'https-proxy-agent'
import Collection from 'app/models/Collection'


export const HOST = 'https://www.pixiv.net'

export const PAGE = {
	LOGIN: `${HOST}/login.php`,
	AUTHOR: `${HOST}/member.php?id=`,
	ILLUST: `${HOST}/member_illust.php?id=`,
	MULTIPLE: `${HOST}/member_illust.php?mode=manga&illust_id=`
}

export default
class Pixiv {
	constructor() {
		Object.assign(this, {
			_headers: null,
			_proxy: '',
			_multipleList: [],
			_picList: [],
			_nextPage: ''
		})
	}
	set(prop, value) {
		if (value === undefined)
			throw new Error('value should not be undefined')
		this[`_${prop}`] = value
	}
	get(prop) {
		return this[`_${prop}`]
	}
	async request({url, proxy, headers, ...option}) {
		headers = headers || this._headers
		proxy = proxy || this._proxy
		try {
			const res = await fetch(url, {
				agent: proxy && new ProxyAgent(proxy),
				headers,
				...option
			})
			return res
		} catch (err) {
			throw err
		}
	}
	//登录，获取cookie并装填headers
	async login(option) {
		try {
			//获取请求页面的返回头
			option.url = option.url || PAGE.LOGIN
			const res = await this.request(option)
			//设置请求头
			const headers = new Headers({
				cookie: res.headers.getAll('set-cookie'),
				referer: HOST
			})
			
			return this._headers = headers
		} catch (err) {
			console.error(`登陆失败--${err}`)
		}
	}
	//查找当前页面的图片
	async queryPicture(option) {
		try {
			//获取作品页html
			option.url = option.url || PAGE.ILLUST + option.authorId
			const res = await this.request(option)
			const text = await res.text()

			//解析html，获取图片元素
			const collect = new Collection(text)
			//解析作品页
			const obj = collect.parseIllust()

			this._picList = obj.picList
			this._multipleList = obj.multipleList

			//解析下一页的url
			const href = collect.parseNextPage()
			this._nextPage = option.url.split('?')[0] + href
		} catch (err) {
			return console.error(`作品页面解析失败--${err}`)
		}

		for (const v of this._multipleList) {
			try {
				option.url = PAGE.MULTIPLE + String(v.src.match(/[^\/]*$/)).replace(/_p0_.*$/, '')
				const res = await this.request(option)
				const text = await res.text()

				//解析html，获取图片元素
				const collect = new Collection(text)
				//解析详情页
				const list = collect.parseMultiple()

				this._picList = this._picList.concat(list)
			} catch (err) {
				return console.error(`相册页面解析失败--${err}`)
			}
		}

		return this._picList
	}
}
