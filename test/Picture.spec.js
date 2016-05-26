import sinon from 'sinon'
import chai from 'chai'
import path from 'path'
import Picture from 'app/models/Picture'
import fs from 'app/lib/promise-fs'

const expect = chai.expect


describe('Picture', function() {
	this.timeout(10000)
	const option = {
		src: 'http://i3.pixiv.net/c/150x150/img-master/img/2015/02/24/00/00/21/48931302_p0_master1200.jpg',
		name: '48931302_p0_master1200.jpg'
	}
	const downloadOption = {
		headers: new Headers({
			cookie: 'PHPSESSID=10419852_43bd297b3f4ebfc3cd8c406d1468ff7b',
			referer: 'https://www.pixiv.net'
		}),
		path: path.join(process.cwd(), 'download'),
		proxy: 'http://127.0.0.1:8787'
	}
	let pic = null
	let progresscall = null
	let notFoundcall = null
	let finishedcall = null

	beforeEach(() => {
		pic = new Picture(option)
		progresscall = sinon.spy()
		notFoundcall = sinon.spy()
		finishedcall = sinon.spy()
	})
	after(async () => {
		// await fs.rmdirs(downloadOption.path)
	})
	it('constructor', () => {
		expect(pic.get('src')).to.equal(option.src)
		expect(pic.get('name')).to.equal(option.name)
	})

	it('download success', async () => {
		//运行初始回调
		await pic.download(downloadOption)
		const exist = await fs.exists(downloadOption.path)
		expect(exist).to.be.true

		//运行自定义回调
		pic.onProgress = progresscall
		pic.onNotFound = notFoundcall
		pic.onFinished = finishedcall
		await pic.download(downloadOption)
		expect(progresscall.calledOnce).to.be.false
		expect(notFoundcall.calledOnce).to.be.false
		expect(finishedcall.calledOnce).to.be.true
	})

	it('download 404', async () => {
		let {src, ...other} = option
		src = src.replace(/.jpg$/, '.png')
		let error
		try {
			await pic.download({src, ...other})
		} catch (err) {
			error = err
		}
		expect(error).to.be.an('error')
	})
})
