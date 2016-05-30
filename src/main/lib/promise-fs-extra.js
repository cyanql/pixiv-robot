import fsExtra from 'fs-extra'

const promiseFsExtra = {}

Object.keys(fsExtra).forEach(key => {
	promiseFsExtra[key] = (...args) => {
		return new Promise((resolve, reject) => {
			const data = []
			const stream = fsExtra[key](...args)

			stream
				.on('data', function(chunk) {
					data.push(chunk)
				})
				.on('end', function() {
					resolve(data)
				})
				.on('error', function(error) {
					reject(error)
				})
		})
	}
})
;(async () => {
	try {
		console.log(await promiseFsExtra.outputJson('./test.json', {name: 'michael'}))
	} catch (err) {
		console.log(err)
	}
})()
export default promiseFsExtra
