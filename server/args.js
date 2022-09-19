// A simple tool for parsing the command line arguments
const cmd = require("./back/cmdline");

cmd.describe([
	cmd.descriptor("port", "p", 443, 
	"Sets the port on which the HTTPS server is listening."),
	cmd.descriptor("http_port", "hp", 80, 
	"Sets the port on which the HTTP server (redirect to HTTPS) is listening."),
	cmd.descriptor("dev", "d", false, 
	"Tells the server if it's in deployment or development currently (use it when in developement)."),
]);

module.exports = cmd.args;