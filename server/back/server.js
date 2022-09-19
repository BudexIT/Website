const http = require("http");
const https = require("https");

const args = require("../args");
const ssl = require("./ssl");

const handler = require("../handler");

// The HTTPS server
https.createServer(ssl.options(), handler.handle).listen(args.port);
	
// Redirect to HTTPS through HTTP
http.createServer((req, res) => {
	res.writeHead(301,{Location: `https://${req.headers.host}${req.url}`});
	res.end();
}).listen(args.http_port);

if(args.dev) {
	console.log(`Running at https://localhost:${args.port}/`);
}
