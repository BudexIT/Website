const mime = require("mime");
const fs = require("fs");

const dir = require("./back/servedir")

// Dirty - preload files (we should scan the folder for them instead)
const files = dir.loadFiles("public/");

function handle(req, res) {
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
	}
	else {
		res.setHeader("Content-Type", mime.getType("/404.html"));
		res.writeHead(404);
		res.end("<h1 style=\"\">Error 404 - Not Found</h1>");
	}
}

module.exports = { handle };