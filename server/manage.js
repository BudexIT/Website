// Code for the manager tool

const dir = require("./back/fileserve");

const clientList = new Map();

module.exports = async (req, res) =>  {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	if(req.method == "POST") {  
		const buffers = [];

		for await (const chunk of req) {
		buffers.push(chunk);
		}
	
		const pass = Buffer.concat(buffers).toString();
		
		// Temporary - need to set up a login system with hashed passwords
		if(pass == "uname=beProsto&psw=Easy1234") {
			console.log("Logged in!");
			clientList.set(ip, true);
			
			setTimeout(() => {
				console.log("Automatically logged out!");
				clientList.delete(ip);
			}, 1000*60);
		}
		
	}

	if(!clientList.get(ip)) {

		const {mime, data} = dir.loadFileData("protected/manage/login.html");

		res.setHeader("Content-Type", mime);
		res.writeHead(200);
		res.end(data);

	}
	else {

		const {mime, data} = dir.loadFileData("protected/manage/logon.html");

		res.setHeader("Content-Type", mime);
		res.writeHead(200);
		res.end(data);
	}

	return true;
};