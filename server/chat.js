// Code for the chat

const fs = require("fs");
// const ws = require('ws');

const dir = require("./back/fileserve");
const args = require("./args")

// const wsServer = new ws.Server({
// 	port: args.http_port
// });

function handleGet(req, res) {
	return false;
}

function handlePost(req, res) {
	return false;
}

module.exports = async (req, res) =>  {
	await loadRequestBody(req);

	switch(req.method) {
		case "POST": return handlePost(req, res);
		case "GET": return handleGet(req, res);
		default: return false;
	}
};