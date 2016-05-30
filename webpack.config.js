const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const BUILD_PATH = path.resolve(__dirname, 'build')
const SRC_PATH = path.resolve(__dirname, 'src')

const config = {
    target: 'electron',
    entry: {
        index: ['./src/renderer/index.js']
    },
    output: {
        path: BUILD_PATH, //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: '/build/', //模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'js/[name].js' //每个页面对应的主js的生成配置
            // chunkFilename: 'js/[id].chunk.js' //chunk生成的配置
    },
    resolve: {
        root: process.cwd(),
        alias: {
			renderer: 'src/renderer',
            assets: 'assets'
        },
        extensions: ['', '.js', '.vue']
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue'
        }, {
            test: /\.less$/,
            include: SRC_PATH,
            loader: ExtractTextPlugin.extract('vue-style-loader', 'css!less')
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.(jpg|png)$/,
            loader: 'url?name=images/[name].[ext]&limit=51200'
        }, {
            test: /\.(eot|svg|ttf|woff)$/,
            loader: 'url?name=fonts/[name].[ext]&limit=1000'
        }]
    },
	externals: {
		cheerio: 'window'
	},
    plugins: [
        new ExtractTextPlugin('css/[name].css', {
            allChunks: false
        })
    ]
}

//多文件入口，html模版生成
for (let name in config.entry) {
    if (name !== 'lib') {
        config.plugins.push(new HtmlWebpackPlugin({
            title: 'Pixiv@robot',
            chunks: [name],
            filename: './renderer/' + name + '.html',
            inject: 'body',
            hash: true,
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }))
    }
}

if (process.env.NODE_ENV === 'development') {
    for (name in config.entry) {
        if (name !== 'lib') {
            config.entry[name].unshift('webpack/hot/only-dev-server')
            config.entry[name].unshift('webpack-dev-server/client?http://localhost:3000')
        }
    }
    config.plugins.unshift(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"development"'
        }
    }))
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin())
    config.devtool = 'source-map'
}


if (process.env.NODE_ENV === 'production') {
    config.plugins.unshift(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }))
    config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }))
}

module.exports = config
