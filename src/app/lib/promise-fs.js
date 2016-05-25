import path from 'path';
import fs from 'fs';

export default {
	...fs,
	mkdirs,
	mkdir,
	exists,
	readFile,
	writeFile,
	readdir
};

//创建多级不存在文件夹
export
async function mkdirs(dirname, mode) {
	//检查当前路径是否存在
	let exist = await exists(dirname);

	//递归上一级目录直到存在
	if (exist) {
		return;
	} else {
		await mkdirs(path.dirname(dirname), mode);
        await mkdir(dirname, mode);
	}
}

//文件读取
export
async function readdir(pathname, option) {
	return new Promise((resolve, reject) => {
		fs.readdir(pathname, option, (err, data) => {
			err ? reject(err) : resolve(data);
		});
	});
}

//文件读取
export
async function readFile(pathname, option) {
	return new Promise((resolve, reject) => {
		fs.readFile(pathname, option, (err, data) => {
			err ? reject(err) : resolve(data);
		});
	});
}

//文件写入
export
async function writeFile(pathname, data, option) {
	//若不存在文件夹，则创建该文件夹
	await mkdirs(path.dirname(pathname));

	return new Promise((resolve, reject) => {
		fs.writeFile(pathname, data, option, (err) => {
			err ? reject(err) : resolve();
		});
	});
}

//创建一级不存在文件夹
export
function mkdir(dirname, mode) {
	return new Promise((resolve, reject) => {
		fs.mkdir(dirname, mode, (err) => {
			err ? reject(err) : resolve();
		});
	});
}

//文件是否存在
export
function exists(dirname) {
	return new Promise((resolve) => {
		fs.exists(dirname, (exists) => {
			resolve(exists);
		});
	});
}
