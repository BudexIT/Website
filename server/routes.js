const dir = require("./back/servedir")
const rt = require("./back/routing");

rt.addRoute("/manage", (req, res) => {
	console.log("manage, " + req.url);
	return dir.serveDirectory("protected/", req, res);
});

rt.addRoute("/", (req, res) => {
	console.log("index, " + req.url);
	return dir.serveDirectory("public/", req, res);
});


module.exports = { useRoutes: rt.useRoutes };