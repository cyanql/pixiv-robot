import path from 'path'
import fs from 'fs'

export default {
	...fs,
	unlink,
	rmdirs,
	rmdir,
	mkdirs,
	mkdir,
	exists,
	readFile,
	writeFile,
	readdir
}
export
async function rmdirs(pathname) {
	//检查当前路径是否存在
	const exist = await exists(pathname)

	if (exist) {
		const filenames = await readdir(pathname)
		for (let filename of filenames) {
			const currpath = path.join(pathname, filename)
			if (fs.lstatSync(currpath).isDirectory()) {
				//递归到最下级目录
				rmdirs(currpath)
			} else {
				//删除文件
				await unlink(currpath)
			}
		}
		await rmdir(pathname)
    }
}

export
async function rmdir(pathname) {
	return new Promise((resolve, reject) => {
		fs.rmdir(pathname, (err) => {
			err ? reject(err) : resolve()
		})
	})
}

export
async function unlink(pathname) {
	return new Promise((resolve, reject) => {
		fs.unlink(pathname, (err) => {
			err ? reject(err) : resolve()
		})
	})
}
//创建多级不存在文件夹
export
async function mkdirs(pathname, mode) {
	//检查当前路径是否存在
	const exist = await exists(pathname)

	//递归上一级目录直到存在
	if (exist) {
		return
	} else {
		await mkdirs(path.dirname(pathname), mode)
        await mkdir(pathname, mode)
	}
}

//文件读取
export
async function readdir(pathname, option) {
	return new Promise((resolve, reject) => {
		fs.readdir(pathname, option, (err, data) => {
			err ? reject(err) : resolve(data)
		})
	})
}

//文件读取
export
async function readFile(pathname, option) {
	return new Promise((resolve, reject) => {
		fs.readFile(pathname, option, (err, data) => {
			err ? reject(err) : resolve(data)
		})
	})
}

//文件写入
export
async function writeFile(pathname, data, option) {
	//若不存在文件夹，则创建该文件夹
	await mkdirs(path.dirname(pathname))

	return new Promise((resolve, reject) => {
		fs.writeFile(pathname, data, option, (err) => {
			err ? reject(err) : resolve()
		})
	})
}

//创建一级不存在文件夹
export
function mkdir(pathname, mode) {
	return new Promise((resolve, reject) => {
		fs.mkdir(pathname, mode, (err) => {
			err ? reject(err) : resolve()
		})
	})
}

//文件是否存在
export
function exists(pathname) {
	return new Promise((resolve) => {
		fs.exists(pathname, (exists) => {
			resolve(exists)
		})
	})
}
