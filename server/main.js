const http = require("http");
const https = require("https");
const fs = require("fs");
const mime = require("mime")

// A simple tool for parsing the command line arguments
const cmd = require("./cmdline")

cmd.describe([
	cmd.descriptor("port", "p", 443, 
	"Sets the port on which the HTTPS server is listening."),
	cmd.descriptor("http_port", "hp", 80, 
	"Sets the port on which the HTTP server (redirect to HTTPS) is listening."),
	cmd.descriptor("env", "e", "deploy", 
	"Tells the server if it's in deployment or development currently (use dev when in developement)."),
]);

const PORT = cmd.arg("port", "p", 443);
const HTTP_PORT = cmd.arg("http_port", "hp", 80);
const DEV_ENV = cmd.arg("env", "e", "deploy") == "dev";

// Dirty - preload files (we should scan the folder for them instead)
const files = {};
function loadPublicFile(name) { files[name] = fs.readFileSync(`./public${name}`); }
loadPublicFile("/index.html");
loadPublicFile("/contact/index.html");
loadPublicFile("/manage/index.html");
loadPublicFile("/index.css");
loadPublicFile("/favicon.ico");
loadPublicFile("/banner.jpg");
loadPublicFile("/ralsei.gif");

// The HTTPS server
https.createServer((()=> {
	if(DEV_ENV) {
		return {
			key: fs.readFileSync("./dev/ssl/key.pem"),
			cert: fs.readFileSync("./dev/ssl/cert.pem")
		};
	}
	else {
		return {
			key: fs.readFileSync("/etc/letsencrypt/live/budexit.wroclaw.pl/privkey.pem"),
			cert: fs.readFileSync("/etc/letsencrypt/live/budexit.wroclaw.pl/fullchain.pem")
		};
	}
})(), (req, res) => {
	
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

}).listen(PORT);

if(DEV_ENV) {
	console.log(`Running at https://localhost:${PORT}/`);
}

// Redirect to HTTPS
http.createServer((req, res) => {
	res.writeHead(301,{Location: `https://${req.headers.host}${req.url}`});
	res.end();
}).listen(HTTP_PORT);