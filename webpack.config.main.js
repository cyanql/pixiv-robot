const path = require('path')
const webpack = require('webpack')

const BUILD_PATH = path.resolve(__dirname, 'build')
const SRC_PATH = path.resolve(__dirname, 'src')

const config = {
	target: 'electron-main',
	entry: {
		index: ['./src/main/index.js']
	},
	output: {
		path: BUILD_PATH,
		publicPath: './', //模板、样式、脚本、图片等资源对应的路径
		filename: 'main/[name].js' //每个页面对应的主js的生成配置
			// chunkFilename: 'js/[id].chunk.js' //chunk生成的配置
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel'
		}, {
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.(jpg|png)$/,
			loader: 'url?name=images/[name].[ext]&limit=51200'
		}]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.OccurrenceOrderPlugin()
	]
}

module.exports = config
