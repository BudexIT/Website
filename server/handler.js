const mime = require("mime");
const fs = require("fs");

const rts = require("./routes");

const Html404 = fs.readFileSync("protected/404/index.html");
const Mime404 = mime.getType("/404.html");

function handle(req, res) {
	const routeFound = rts.useRoutes(req, res);
	
	if(!routeFound) {
		res.setHeader("Content-Type", Mime404);
		res.writeHead(404);
		res.end(Html404);
	}

}

module.exports = { handle };