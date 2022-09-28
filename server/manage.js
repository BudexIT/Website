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

module.exports = async (req, res) =>  {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	
	if(req.method == "POST" && !clientList.get(ip)) {
		const pass = await getBufferData(req);
		
		// Temporary - need to set up a login system with hashed passwords
		if(pass == "uname=beProsto&psw=Easy1234") {
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

		const formData = new FormData(command);
		
		const data = {};
		formData.forEach((value, key) => (data[key] = value));

		console.log(data);
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
		res.end(data);
	}

	return true;
};