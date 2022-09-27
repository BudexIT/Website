const dir = require("./back/fileserve")
const rt = require("./back/routing");

const manage = require("./manage")

rt.addRoute("/manage", (req, res) => {
	console.log("manage, " + req.url);
	return manage(req, res);
});

rt.addRoute("/", (req, res) => {
	console.log("index, " + req.url);
	return dir.serveDirectory("public/", req, res);
});


module.exports = { useRoutes: rt.useRoutes };