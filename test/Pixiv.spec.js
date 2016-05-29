import Pixiv from 'app/models/Pixiv'
import chai from 'chai'
const expect = chai.expect


describe('Pixiv', function() {
	this.timeout(30000)
	let pixiv = null

	beforeEach(() => {
		pixiv = new Pixiv()
	})

	it('set & get', () => {
		pixiv.set('prop', 'value')
		expect(pixiv.get('prop')).to.eql('value')
		expect(pixiv.set.bind(pixiv, 'other')).to.throw('not be undefined')
	})

	it('requestAsync', async () => {
		const option = {
			url: 'xxxxxxxxxx'
		}
		let error
		try {
			const res = await pixiv.requestAsync(option)
			expect(res.status).to.eql(200)
		} catch (err) {
			error = err
		}
		expect(error).to.be.an('error')
	})

	it.only('loginAsync', async () => {
		const username = 'pixivrobot@gmail.com'
		const password = 'pixiv123456'
		const option = {
			username,
			password
		}
		const res = await pixiv.loginAsync(option)
		const cookie = res.headers.getAll('set-cookie')

		expect(cookie).to.be.an('array')
		expect(cookie).to.have.length.least(1)
		expect(cookie).to.satisfy((data) => data.some(v => /PHPSESSID.*\d+_\d+/.test(v)))
	})

	it('queryPictureAsync', async () => {
		const option = {
			headers: {
				cookie: 'PHPSESSID=18465367_b8d1cf1ebc6947607d0167647c84cb34'
			},
			proxy: 'http://127.0.0.1:8787',
			authorId: '1248336&type=all&p=4'
		}

		const picList = await pixiv.queryPictureAsync(option)
		expect(picList).to.be.an('array')
		expect(picList).to.have.length.of.at.least(20)
		expect(picList).to.satisfy((data) => data.every(v => /150x150/.test(v.src)))
	})
})
