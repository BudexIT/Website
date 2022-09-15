const http = require("http");
const https = require("https");
const fs = require("fs");

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

// Dirty - preload files
const files = {};
function loadFile(name) { files[name] = fs.readFileSync(`./public${name}`); }
loadFile("/index.html");
loadFile("/contact/index.html");
loadFile("/index.css");
loadFile("/favicon.ico");
loadFile("/banner.jpg");
loadFile("/ralsei.gif")

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
	
	// Dirty - return preloaded files
	switch(req.url) {
		case "/": {
			res.writeHead(200);
			res.end(files["/index.html"]);
			break;
		}
		case "/contact/":
		case "/contact": {
			res.writeHead(200);
			res.end(files["/contact/index.html"]);
			break;
		}
		default: {
			if(files[req.url]) {
				res.writeHead(200);
				res.end(files[req.url]);
				break;
			}
			res.writeHead(404);
			res.end("<h1>404</h1>");
			break;
		}

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