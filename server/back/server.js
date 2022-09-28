const http = require("http");
const https = require("https");
const bodyParser = require("body-parser");

const args = require("../args");
const ssl = require("./ssl");

const handler = require("../handler");

const urlencodedParser = bodyParser.urlencoded({extended:true});

// The HTTPS server
https.createServer(ssl.options(), async (req, res) => {
	urlencodedParser(req, res, ()=>{}); 
	await handler(req, res);
}).listen(args.port);
	
// Redirect to HTTPS through HTTP
http.createServer((req, res) => {
	res.writeHead(301,{Location: `https://${req.headers.host}${req.baseUrl}`});
	res.end();
}).listen(args.http_port);

if(args.dev) {
	console.log(`Running at https://localhost:${args.port}/`);
}
