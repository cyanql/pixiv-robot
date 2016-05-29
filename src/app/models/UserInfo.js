import fs from 'fs-extra-promise'
import path from 'path'

export default
class UserInfo {
	constructor(option = {}) {
		Object.assign(this, {
			_username: '',
			_password: '',
			_cookie: '',
			_proxy: '',
			_downloadPath: '',
			_cachePath: path.join(process.cwd(), 'cache'),
			_filename: 'userinfo.json'
		})

		Object.keys(option).forEach(key => {
			this[`_${key}`] = option[key]
		})
	}
	/**
	 * 更新属性的值
	 * @param {[string]} prop	更新已经存在的属性
	 * @param {[all]} 	value 	任何类型
	 */
	update(prop, value) {
		prop = `_${prop}`
		if (value === undefined)
			throw new Error('value should not be undefined')
		if (!(prop in this))
			throw new Error(`'${prop}' is not exists, you should create it when init`)

		this[prop] = value
	}
	/**
	 * 获取属性值
	 * @param  {[string]} prop 	只能获取已存在的属性
	 * @return {[all]}     初始化或更新所设置的值
	 */
	get(prop) {
		prop = `_${prop}`
		if (!(prop in this))
			throw new Error(`'${prop}' is not exists, you should create it when init`)

		return this[prop]
	}

	delete(prop) {
		delete this[`_${prop}`]
	}
	/**
	 * 从本地读取信息
	 * @param  {[string]} pathname 路径+文件名
	 */
	loadFromLocal(pathname = path.join(this._cachePath, this._filename)) {
		try {
			const json = fs.readJsonSync(pathname)
			Object.assign(this, json)
		} catch (err) {
			console.error(`loadFromLocalAsync fail-${err}`)
		}
	}
	/**
	 * 存储信息到本地
	 * @param  {[string]} pathname 路径+文件名
	 */
	saveToLocal(pathname = path.join(this._cachePath, this._filename)) {
		try {
			fs.outputJsonSync(pathname, this)
		} catch (err) {
			console.error(`saveToLocalAsync fail-${err}`)
		}
	}
}
