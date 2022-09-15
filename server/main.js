const PORT = process.env.PORT || 443;
const DEV_ENV = process.env.ENV == "dev";

const https = require("https");
const fs = require("fs");

function options() {
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
}

https.createServer(options(), function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(PORT);

if(DEV_ENV) {
  console.log(`Running at https://localhost:${PORT}/`);
}