import fetch from 'isomorphic-fetch'
import fs from 'app/lib/promise-fs'
import ProxyAgent from 'https-proxy-agent'
import path from 'path'

export default
class Picture {
	constructor({src, name, width, height}) {
		Object.assign(this, {
			_src: src,
			_name: name,//src.match(/[^\/]*$/).toString(),
			_width: width,
			_height: height
		})
	}
	get(prop) {
		return this[`_${prop}`]
	}
	async download(option) {
		let res
		try {
			res = await fetch(this._src, {
				headers: option._headers,
				agent: option._proxy && new ProxyAgent(option._proxy)
			})
		} catch (err) {
			return console.error(`err -> request Picture :${this._name}\n${err}`)
		}

		if (res && res.status == 404 && this._src.match(/\.jpg$/)) {
			console.error(`404:${this._src}`)
			this._src = this._src.replace(/\.jpg$/, '.png')
			this._name = this._name.replace(/\.jpg$/, '.png')
			return this.download(path)
		} else {
			return new Promise((resolve) => {
				//创建读取流、写入流、内容总大小，当前大小
				const rs = res.body
				const ws = fs.createWriteStream(path.join(option.path, this._name))
				const maxlen = res.headers.get('Content-Length')
				let currentlen = 0

				//读取流挂载下载、错误监听事件
				rs
					.on('data', (chunk) => {
						currentlen += chunk.length
						this.onProgress((currentlen / maxlen * 100).toFixed(2) + '%')
					})
					.on('error', (err) => {
						console.log(`网络连接异常:${err}`)
					})

				//写入流挂载完成、错误监听事件
				ws
					.on('finish', () => {
						this.onFinished()
						resolve()
					})
					.on('error', (err) => {
						console.log(`图片写入异常:${err}`)
					})

				//管道连接
				rs.pipe(ws)
			})
		}
	}
	onProgress() {}
	onFinished() {}
}
