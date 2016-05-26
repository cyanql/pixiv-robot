import fs from 'app/lib/promise-fs'

export default
class UserInfo {
	constructor(option) {
		Object.assign(this, {
			username: '',
			password: '',
			cookie: '',
			proxy: '',
			downloadPath: '',
			...option
		})
	}
	set(prop, value) {
		if (value === undefined)
			throw new Error('value should not be undefined')
		if (!(prop in this))
			throw new Error(`'${prop}' is not allowed to set, you should create it when init`)

		this[`_${prop}`] = value
	}
	get(prop) {
		if (!(prop in this))
			throw new Error(`'${prop}' is not allowed to get, you should create it when init`)

		return this[`_${prop}`]
	}
	delete(prop) {
		delete this[`_${prop}`]
	}
	async saveToLocal(pathname) {
		try {
			await fs.writeFile(pathname, JSON.stringify(this))
		} catch (err) {
			throw new Error(`saveToLocal fail:\n${err}`)
		}
	}
}
