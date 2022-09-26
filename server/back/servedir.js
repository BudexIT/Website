const fs = require("fs");
const path = require("path");
const mime = require("mime");
const args = require("../args");

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
		// console.log(storename);
		files[storename] = fs.readFileSync(filename);
	});

	return files;
}

// Preload files on first request
const preloaded = new Map();

function serveDirectory(dirname, req, res) {
	// Upon first request, the files are cached (we don't cache in developement)
	let files = preloaded.get(dirname);
	if(!files || args.dev) {
		// console.log("Cached!");
		files = loadFiles(dirname);
		preloaded.set(dirname, files);
	}

	if(req.url.slice(-1)[0] == '/') {
		req.url = req.url.slice(0, -1);
	}

	let strlist = req.url.split('/');
	if(strlist[strlist.length - 1].indexOf('.') < 0) {
		// assume it's an index.html
		req.url = req.url + "/index.html";
	}
	
	if(files[req.url]) {
		res.setHeader("Content-Type", mime.getType(req.url));
		res.writeHead(200);
		res.end(files[req.url]);

		return true;
	}
	else {
		return false;
	}
}

module.exports = { serveDirectory };