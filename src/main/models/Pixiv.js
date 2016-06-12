import fetch from 'isomorphic-fetch'
import ProxyAgent from 'https-proxy-agent'
import Collection from './Collection'
import fs from 'fs-extra-promise'

function pathParse(url) {
	return url.split('://').slice(1).toString()
}

export default
class Pixiv {
	static HOST = 'https://www.pixiv.net'
	static PAGE = {
		LOGIN: `${Pixiv.HOST}/login.php`,
		AUTHOR: `${Pixiv.HOST}/member.php?id=`,
		ILLUST: `${Pixiv.HOST}/member_illust.php?id=`,
		MULTIPLE: `${Pixiv.HOST}/member_illust.php?mode=manga&illust_id=`
	}

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
	/**
	 * 请求
	 * @param  {[string]} url 		请求地址
	 * @param  {[string]} proxy    	代理地址
	 * @param  {[object]} headers  	请求头设置
	 * @param  {[object]} ...option 其它内容
	 * @return {[object]} res 		请求响应内容
	 */
	async requestAsync({url, proxy, headers, ...option}) {
		//配置请求头和代理
		headers = headers || this._headers
		proxy = proxy || this._proxy
		//
		try {
			const res = await fetch(url, {
				agent: proxy && new ProxyAgent(proxy),
				headers: new Headers({
					referer: Pixiv.HOST,
					...headers
				}),
				...option
			})

			if (pathParse(res.url) !== pathParse(url)) {
				throw new Error(`[redirect]${url}重定向至${res.url}`)
			}

			return res
		} catch (err) {
			throw err
		}
	}
	/**
	 * 登录，获取cookie并装填headers
	 * @param  {[object]} option
	 * {
	 *  	url,
	 *  	proxy,
	 *   	username,
	 *   	password
	 * }
	 * @return {[object]}  res 请求返回内容
	 */
	async loginAsync (option) {
		try {
			//获取请求页面的返回头
			const url = option.url || Pixiv.PAGE.LOGIN
			const res = await this.requestAsync({
				url,
				method: 'POST',
				mode: 'no-cors',
				redirect: 'manual',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				proxy: option.proxy,
				body: `mode=login&pixiv_id=${option.username}&pass=${option.password}&skip=1`
			})
			//设置请求头
			this._headers = {
				cookie: res.headers.getAll('set-cookie')
			}
			return res
		} catch (err) {
			throw `登陆失败--${err}`

		}
	}
	/**
	 *	查找当前页面的图片
	 * @param  {[Object]} option
	 * {
	 *      authorId,
	 *      url,
	 *      proxy,
	 *      headers
	 *      ...
	 * }
	 * @return {[Object Array]} _picList
	 * [{
	 * 		src
	 * }]
	 */
	async queryPictureAsync(option) {
		try {
			//获取作品页html
			option.url = option.url || Pixiv.PAGE.ILLUST + option.authorId
			const res = await this.requestAsync(option)
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
			throw `作品页面解析失败--${err}`
		}


		for (const v of this._multipleList) {
			try {
				option.url = Pixiv.PAGE.MULTIPLE + String(v.src.match(/[^\/]*$/)).replace(/_p0_.*$/, '')
				const res = await this.requestAsync(option)
				const text = await res.text()

				//解析html，获取图片元素
				const collect = new Collection(text)
				//解析详情页
				const list = collect.parseMultiple()

				this._picList = this._picList.concat(list)
			} catch (err) {
				throw `相册页面解析失败--${err}`
			}
		}

		return this._picList
	}
}
