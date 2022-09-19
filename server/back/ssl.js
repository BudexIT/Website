
const fs = require("fs");
const args = require("../args")

function options() {
	const options = {};
	if(args.dev) {
		options["key"] = fs.readFileSync("./dev/ssl/key.pem"),
		options["cert"] = fs.readFileSync("./dev/ssl/cert.pem")
	}
	else {
		options["key"] = fs.readFileSync("/etc/letsencrypt/live/budexit.wroclaw.pl/privkey.pem"),
		options["cert"] = fs.readFileSync("/etc/letsencrypt/live/budexit.wroclaw.pl/fullchain.pem")
	}
	return options;
}

module.exports = { options };