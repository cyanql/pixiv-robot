import sinon from 'sinon'
import chai from 'chai'
import path from 'path'
import Picture from '../src/main/models/Picture'
import fs from 'fs-extra-promise'

const expect = chai.expect


describe('Picture', function() {
	this.timeout(10000)
	const option = {
		src: 'http://i3.pixiv.net/c/150x150/img-master/img/2015/02/24/00/00/21/48931302_p0_master1200.jpg',
		name: '48931302_p0_master1200.jpg'
	}
	const downloadOption = {
		headers: {
			cookie: 'PHPSESSID=18465367_b8d1cf1ebc6947607d0167647c84cb34',
			referer: 'https://www.pixiv.net'
		},
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
		await fs.removeAsync(downloadOption.path)
	})

	it('constructor', () => {
		expect(pic.get('src')).to.equal(option.src)
		expect(pic.get('name')).to.equal(option.name)
	})

	it('downloadAsync success', async () => {
		//运行初始回调
		await pic.downloadAsync(downloadOption)
		const exist = await fs.existsAsync(downloadOption.path)
		expect(exist).to.be.true

		//运行自定义回调
		pic.onProgress = progresscall
		pic.onNotFound = notFoundcall
		pic.onFinished = finishedcall
		await pic.downloadAsync(downloadOption)
		expect(progresscall.calledOnce).to.be.false
		expect(notFoundcall.calledOnce).to.be.false
		expect(finishedcall.calledOnce).to.be.true
	})

	it('downloadAsync 404', async () => {
		let {src, ...other} = option
		src = src.replace(/.jpg$/, '.png')
		let error
		try {
			await pic.downloadAsync({src, ...other})
		} catch (err) {
			error = err
		}
		expect(error).to.be.an('error')
	})
})
