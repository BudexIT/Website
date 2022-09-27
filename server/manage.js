// Code for the manager tool

const dir = require("./back/fileserve");

module.exports = async (req, res) =>  {
	switch(req.method) {
		case "POST": {  
			const buffers = [];

			for await (const chunk of req) {
			buffers.push(chunk);
			}
		
			const data = Buffer.concat(buffers).toString();
		
			console.log(`YO GOT A MESSAGE: ${data}`);
		}
		default: {
			return dir.serveDirectory("protected/", req, res);
		}
	}
};