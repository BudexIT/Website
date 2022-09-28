// Code for the manager tool

const fs = require("fs");
const child = require("child_process");

const dir = require("./back/fileserve");

const clientList = new Map();

const managerViewBase = `
	<style>
		.container {
			border: solid 2px rgba(255,255,255,0.8);
			padding: 2px;
			background: rgba(0,0,0,0.4);
			width: 350px;
			height: 200px;
			overflow-y: auto;
		}
	</style>
	<form method="post">
		<div class="login_form">
			<label for="cmd"><b>Komenda:</b></label>
			<input type="text" placeholder="Make me do something daddy~" name="cmd" required>
			<button type="submit">Wykonaj</button>
		</div>
	</form>
	<p></p>
`;

let managerView = `
	${managerViewBase}
	<div class="container">
	</div>
`;

const TIMEOUT = 60*1000;

function handleGet(req, res) {
	return renderView(req, res);
}
function handlePost(req, res) {
	const id = getClientId(req);
	const client = clientList.get(id);

	if(!client) {
		return handleLogin(req, res);
	}
	else {
		return handleLogon(req, res);
	}

}

function renderView(req, res) {
	const id = getClientId(req);
	const client = clientList.get(id);

	if(!client) {	
		const {mime, data} = dir.loadFileData("protected/manage/login.html");

		res.setHeader("Content-Type", mime);
		res.writeHead(200);
		res.end(data);

	}
	else {
		const {mime, data} = dir.loadFileData("protected/manage/logon.html");

		client.didAnything = true;

		res.setHeader("Content-Type", mime);
		res.writeHead(200);
		res.end(data.toString().replace("<MANAGER_VIEW/>", managerView));
	}

	return true;
}

function handleLogin(req, res) {
	const id = getClientId(req);

	const users = JSON.parse(fs.readFileSync("private/users.json"));

	const inName = req.body.uname;
	const inPass = req.body.psw;

	if(users[inName] && users[inName].pass == inPass) {
		console.log(`${inName} logged in`);

		clientList.set(id, {didAnything: true});
		
		const logout = () => {
			if(clientList.get(id).didAnything) {
				clientList.get(id).didAnything = false;
				setTimeout(logout, TIMEOUT);
			}
			else {
				console.log("Automatically logged out!");
				clientList.delete(id);
			}
		};
		setTimeout(logout, TIMEOUT);
	}

	return renderView(req, res);
}

let insideContainer = ``;
function handleLogon(req, res) {
	child.exec(req.body.cmd, (error, stdout, stderr) => {
		if(error) {
			console.log(`error: ${error.message}`);
		}
		if(stderr) {
			console.log(`stderr: ${stderr}`);
			insideContainer += '<p style="color: red;">' + stderr + '</p>';
		}
		console.log(`stdout: ${stdout}`);
		insideContainer += "<p>" + stdout + "</p>";
		
		managerView = `
			${managerViewBase}
			<div class="container">
				${insideContainer}
			</div>
		`;

		renderView(req, res);
	});

	return true;
}

module.exports = async (req, res) =>  {
	await loadRequestBody(req);

	switch(req.method) {
		case "POST": return handlePost(req, res);
		case "GET": return handleGet(req, res);
		default: return false;
	}
};

function getClientId(req) { return req.headers['x-forwarded-for'] || req.connection.remoteAddress + ":" + req.headers['user-agent']; }
async function loadRequestBody(req) { const buffers = []; for await (const chunk of req) { buffers.push(chunk); } return Buffer.concat(buffers).toString(); }
