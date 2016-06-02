import UserInfo from '../src/main/models/UserInfo'
import fs from 'fs-extra-promise'
// import path from 'path'
import chai from 'chai'
const expect = chai.expect


describe('UserInfo', () => {
	const info = {
		other: {
			prop: 'value'
		}
	}
	let user = null
	beforeEach(() => {
		user = new UserInfo(info)
	})

	it('constructor', () => {
		//是否存在所有的初始化信息
		expect(user.get('other')).to.contain.all.keys(info.other)
	})

	it('update', () => {
		const username = 'pixivrobot'
		const allowKey = 'username'
		const otherKey = 'user'
		user.update(allowKey, username)
		expect(user.get(allowKey)).to.eql(username)
		expect(user.update.bind(user, allowKey)).to.throw('not be undefined')
		expect(user.update.bind(user, otherKey, username)).to.throw('not exists')
	})

	it('get', () => {
		const username = 'pixivrobot'
		const allowKey = 'username'
		const otherKey = 'user'
		user.update(allowKey, username)
		expect(user.get(allowKey)).to.eql(username)
		expect(user.get.bind(user, otherKey)).to.throw('not exists')
	})

	it('delete', () => {
		const username = 'pixivrobot'
		const allowKey = 'username'
		user.update(allowKey, username)
		user.delete(allowKey)
		expect(user.get.bind(user, allowKey)).to.throw('not exists')
	})

	it('saveToLocal & loadFromLocal', async () => {
		user.saveToLocal()

		const temp = new UserInfo()
		temp.loadFromLocal()
		expect(temp.get('other')).to.have.property('prop', 'value')

		await fs.removeAsync(temp.get('cachePath'))
	})

})
