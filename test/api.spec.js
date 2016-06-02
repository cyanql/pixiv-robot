import '../src/main'
import fs from 'fs-extra-promise'
import { ipcRenderer } from 'ipc-main'
import path from 'path'
import chai from 'chai'
const expect = chai.expect


describe('All api', function() {
	this.timeout(20000)

	it('existsCookie', () => {
		ipcRenderer.send('checkCookie-main')
		ipcRenderer.once('checkCookie-renderer', (e, exists) => {
			expect(exists).to.be.false
		})
	})

	it('loginAsync', async () => {
		const option = {
			username: 'pixivrobot@gmail.com',
			password: 'pixiv123456',
			proxy: 'http://127.0.0.1:8787',
			downloadPath: ''
		}

		ipcRenderer.send('loginAsync-main', option)
		ipcRenderer.once('loginAsync-renderer', (e, logined) => {
			expect(logined).to.be.false
		})

		option.password = 'pixiv123456'
		ipcRenderer.send('loginAsync-main', option)
		ipcRenderer.once('loginAsync-renderer', (e, logined) => {
			expect(logined).to.be.true
		})
	})

	it('getPictrueSrcFromLocal', async () => {
		const authorId = '1248336'
		const thumbnailPath = path.join(process.cwd(), 'cache', authorId, 'thumbnail')
		await fs.removeAsync(thumbnailPath)

		ipcRenderer.send('getPicListFromCacheAsync-main', authorId)
		ipcRenderer.once('getPicListFromCacheAsync-renderer', async (e, picList) => {
			expect(picList).to.be.undefined
			await fs.ensureDirAsync(thumbnailPath)
		})
		ipcRenderer.send('getPicListFromCacheAsync-main', authorId)
		ipcRenderer.once('getPicListFromCacheAsync-renderer', async (e, picList) => {
			expect(picList).to.be.empty
			await fs.removeAsync(thumbnailPath)
		})
	})
})
