import fetch from 'isomorphic-fetch'
import fs from 'app/lib/promise-fs'
import ProxyAgent from 'https-proxy-agent'

export default
class User {
	constructor({username, password, proxy}) {
		Object.assign(this, {
			_username: username,
			_password: password,
			_proxy: proxy || '',
			_cookie: ''
		})
	}
	async login() {
		let res
		try {
			res = await fetch('https://www.pixiv.net/login.php', {
				method: 'POST',
				mode: 'no-cors',
				redirect: 'manual',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				// agent: new ProxyAgent(this._proxy),
				body: `mode=login&pixiv_id=${this._username}&pass=${this._password}&skip=1`
			})
		} catch (err) {
			return console.error(`登陆失败:\n${err}`)
		}
		//	fs.writeFile('./log/pixiv_headers.json', JSON.stringify(res))

		this.set('cookie', res.headers.getAll('set-cookie').map(v => v.split(';')[0]).join(';'))
	}
	set(prop, value) {
		if (value === undefined) throw new Error('arguments\' length should be 2')
		this[`_${prop}`] = value
	}
	get(prop) {
		return this[`_${prop}`]
	}
	async saveToLocal() {
		try {
			await fs.writeFile(this.name, JSON.stringify(this))
		} catch (err) {
			throw new Error(`saveToLocal fail:\n${err}`)
		}
	}
}
