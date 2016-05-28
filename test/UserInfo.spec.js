import UserInfo from 'app/models/UserInfo'
import fs from 'fs-promise'
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
		const username = 'michael'
		const allowKey = 'username'
		const otherKey = 'user'
		user.update(allowKey, username)
		expect(user.get(allowKey)).to.eql(username)
		expect(user.update.bind(user, allowKey)).to.throw('not be undefined')
		expect(user.update.bind(user, otherKey, username)).to.throw('not exists')
	})

	it('get', () => {
		const username = 'michael'
		const allowKey = 'username'
		const otherKey = 'user'
		user.update(allowKey, username)
		expect(user.get(allowKey)).to.eql(username)
		expect(user.get.bind(user, otherKey)).to.throw('not exists')
	})

	it('delete', () => {
		const username = 'michael'
		const allowKey = 'username'
		user.update(allowKey, username)
		user.delete(allowKey)
		expect(user.get.bind(user, allowKey)).to.throw('not exists')
	})

	it('saveToLocalAsync & loadFromLocalAsync', async () => {
		await user.saveToLocalAsync()

		const temp = new UserInfo()
		await temp.loadFromLocalAsync()
		expect(temp.get('other')).to.have.property('prop', 'value')

		await fs.remove(temp.get('cachePath'))
	})

})
