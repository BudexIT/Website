const dir = require("./back/fileserve")
const rt = require("./back/routing");

const manage = require("./manage")

rt.addRoute("/manage", async (req, res) => {
	console.log("manage, " + req.url);
	return await manage(req, res);
});

rt.addRoute("/", async (req, res) => {
	console.log("index, " + req.url);
	return dir.serveDirectory("public/", req, res);
});


module.exports = rt.useRoutes;