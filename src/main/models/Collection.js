import cheerio from 'cheerio'

export default
class Collection {
	constructor(text) {
		console.log(text)
		Object.assign(this, {
			_$: cheerio.load(text),
			_multipleList: [],
			_picList: []
		})
	}
	get(prop) {
		return this[`_${prop}`]
	}
	//解析下一页按钮的href
	parseNextPage() {
		return this._$('span.next a').attr('href')
	}
	//解析作品页缩略图
	parseIllust() {
		const $ = this._$
		$('a._work').each((idx, elem) => {
			const src = $(elem).find('img').attr('src')
			if (!src) return
			const item = {
				src
			}

			if ($(elem).hasClass('multiple'))
				this._multipleList.push(item)
			else
				this._picList.push(item)
		})
		return {
			picList: this._picList,
			multipleList: this._multipleList
		}
	}
	//解析相册详情页缩略图
	parseMultiple() {
		const $ = this._$
		$('.image').each((idx, elem) => {
			const src = $(elem).attr('data-src').replace(/1200x1200/g,'150x150')
			if (!src) return

			const item = {
				src
			}
			this._picList.push(item)
		})
		return this._picList
	}
}
