// Code for the manager tool

const dir = require("./back/fileserve");

const clientList = new Map();

async function getBufferData(req) {
	const buffers = [];

	for await (const chunk of req) {
		buffers.push(chunk);
	}

	return Buffer.concat(buffers).toString();
}

let justSomeFun = "";

module.exports = async (req, res) =>  {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	
	if(req.method == "POST" && !clientList.get(ip)) {
		const pass = await getBufferData(req);
		
		console.log(pass, "\n", req.body);

		// Temporary - need to set up a login system with hashed passwords
		if(req.body.uname == "beProsto" && req.body.psw == "Easy1234") {
			console.log("Logged in!");
			clientList.set(ip, {didAnything: true});
			
			const logout = () => {
				if(clientList.get(ip).didAnything) {
					clientList.get(ip).didAnything = false;
					setTimeout(logout, 1000*60);
				}
				else {
					console.log("Automatically logged out!");
					clientList.delete(ip);
				}
			};
			setTimeout(logout, 1000*60);
		}
	}
	else if(req.method == "POST" && clientList.get(ip)) {
		const command = await getBufferData(req);

		console.log(command, "\n", req.body);
		
		justSomeFun += req.body.cmd + "<br/>";
	}


	if(!clientList.get(ip)) {	

		const {mime, data} = dir.loadFileData("protected/manage/login.html");

		res.setHeader("Content-Type", mime);
		res.writeHead(200);
		res.end(data);

	}
	else {
		
		clientList.get(ip).didAnything = true;
		
		const {mime, data} = dir.loadFileData("protected/manage/logon.html");

		res.setHeader("Content-Type", mime);
		res.writeHead(200);
		res.end(data + justSomeFun);
	}

	return true;
};