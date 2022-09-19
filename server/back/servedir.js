const fs = require("fs");
const path = require("path");

function findFiles(where) {
	let list = [];
	const files = fs.readdirSync(where);

	files.forEach((file) => {
		const stat = fs.lstatSync(path.join(where, file));
		if(stat.isDirectory()) {
			list = list.concat(findFiles(path.join(where, file)));
		} else {
			list.push(path.join(where, file));
		}
	});

	return list;
}

function loadFiles(where) {
	const filenameList = findFiles(where);
	const files = {};

	filenameList.forEach((filename) => {
		const storename = filename.slice(where.length - 1, filename.length);
		console.log(storename);
		files[storename] = fs.readFileSync(filename);
	});

	return files;
}

module.exports = { loadFiles };