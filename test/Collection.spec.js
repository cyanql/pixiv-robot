import Collection from 'app/models/Collection'
import fs from 'fs'
import path from 'path'
import chai from 'chai'
const expect = chai.expect


describe('Collection', () => {
	const homeText = fs.readFileSync(path.join(process.cwd(), 'test/source/home.html'), 'utf8')
	const detailText = fs.readFileSync(path.join(process.cwd(), 'test/source/detail.html'), 'utf8')
	const home = new Collection(homeText)
	const detail = new Collection(detailText)

	it('constructor', () => {
		expect(home.get('$')).to.be.a('function')
	})

	it('parseNextPage', () => {
		const href = home.parseNextPage()
		expect(href).to.be.a('string')
		expect(href).to.exist
	})

	it('parseIllust', () => {
		const {picList, multipleList} = home.parseIllust()
		expect(picList).to.be.an('array')
		expect(multipleList).to.be.an('array')
		expect(picList).to.have.length.of.at.most(20)
		picList.concat(multipleList).forEach(v => {
			expect(v).to.have.property('src').that.match(/150x150/)
		})
	})

	it('parseMultiple', () => {
		const picList = detail.parseMultiple()
		expect(picList).to.be.an('array')
		expect(picList).to.have.length.of.at.least(1)
		picList.forEach(v => {
			expect(v).to.have.property('src').that.match(/150x150/)
		})
	})
})
