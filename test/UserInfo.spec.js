import UserInfo from 'app/models/UserInfo'
import fs from 'app/lib/promise-fs'
import path from 'path'
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
		expect(user).to.contain.all.keys(info)
	})

	it('set', () => {
		const username = 'michael'
		const allowKey = 'username'
		const otherKey = 'user'
		user.set(allowKey, username)
		expect(user.get(allowKey)).to.eql(username)
		expect(user.set.bind(user, allowKey)).to.throw('not be undefined')
		expect(user.set.bind(user, otherKey, username)).to.throw('not allowed to set')
	})

	it('get', () => {
		const username = 'michael'
		const allowKey = 'username'
		const otherKey = 'user'
		user.set(allowKey, username)
		expect(user.get(allowKey)).to.eql(username)
		expect(user.get.bind(user, otherKey)).to.throw('not allowed to get')
	})

	it('delete', () => {
		const username = 'michael'
		const allowKey = 'username'
		user.set(allowKey, username)
		user.delete(allowKey)
		expect(user.get(allowKey)).to.be.undefined
	})

	it('saveToLocal', async () => {
		const pathname = path.join(process.cwd(), 'user_info.json')
		await user.saveToLocal(pathname)

		const exist = await fs.exists(pathname)
		expect(exist).to.be.true

		await fs.unlink(pathname)
	})
})
