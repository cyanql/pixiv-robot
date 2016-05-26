import Pixiv from 'app/models/Pixiv'
import chai from 'chai'
const expect = chai.expect


describe('Pixiv', function() {
	this.timeout(20000)
	let pixiv = null

	beforeEach(() => {
		pixiv = new Pixiv()
	})

	it('set & get', () => {
		pixiv.set('prop', 'value')
		expect(pixiv.get('prop')).to.eql('value')
		expect(pixiv.set.bind(pixiv, 'other')).to.throw('not be undefined')
	})

	it('request', async () => {
		const option = {
			url: 'xxxxxxxxxx'
		}
		let error
		try {
			const res = await pixiv.request(option)
		} catch (err) {
			error = err
		}
		expect(error).to.be.an('error')
	})

	it('login', async () => {
		const username = 'icarusves@gmail.com'
		const password = 'michael1123'
		const option = {
			method: 'POST',
			mode: 'no-cors',
			redirect: 'manual',
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded'
			}),
			proxy: 'http://127.0.0.1:8787',
			body: `mode=login&pixiv_id=${username}&pass=${password}&skip=1`
		}
		const headers = await pixiv.login(option)
		const cookie = headers.getAll('cookie')

		expect(cookie).to.be.an('array')
		expect(cookie).to.have.length.least(1)
		expect(cookie).to.satisfy((data) => data.some(v => /PHPSESSID.*\d+_\d+/.test(v)))
	})

	it('queryPicture', async () => {
		const option = {
			headers: new Headers({
				cookie: 'PHPSESSID=10419852_43bd297b3f4ebfc3cd8c406d1468ff7b',
				referer: 'https://www.pixiv.net'
			}),
			proxy: 'http://127.0.0.1:8787',
			url: 'http://www.pixiv.net/member_illust.php?id=45438'
		}

		const picList = await pixiv.queryPicture(option)
		expect(picList).to.be.an('array')
		expect(picList).to.have.length.of.at.least(20)
		expect(picList).to.satisfy((data) => data.every(v => /150x150/.test(v.src)))
	})
})
