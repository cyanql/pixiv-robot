import * as api from 'app/models'
import fs from 'fs-extra-promise'
import path from 'path'
import chai from 'chai'
const expect = chai.expect


describe('All api', function() {
	this.timeout(20000)

	it('existsCookie', () => {
		expect(api.existsCookie()).to.be.false
	})

	it.only('loginAsync', async () => {
		const option = {
			username: 'pixivrobot@gmail.com',
			password: 'pixiv',
			proxy: 'http://127.0.0.1:8787'
		}
		let logined
		logined = await api.loginAsync(option)
		expect(logined).to.be.false

		option.password = 'pixiv123456'
		logined = await api.loginAsync(option)
		expect(logined).to.be.true
	})

	it('getPictrueSrcFromLocal', async () => {
		const authorId = '1248336'
		const thumbnailPath = path.join(process.cwd(), 'cache', authorId, 'thumbnail')
		await fs.removeAsync(thumbnailPath)
		let picList
		picList = await api.getPicListFromCacheAsync(authorId)
		expect(picList).to.be.undefined

		await fs.ensureDirAsync(thumbnailPath)
		picList = await api.getPicListFromCacheAsync(authorId)
		expect(picList).to.be.empty
		await fs.removeAsync(thumbnailPath)
	})
})
