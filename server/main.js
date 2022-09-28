const fs = require("fs");

const users = fs.readFileSync("private/users.json");
if(!users) {
	console.log("Please create a user:");
	
}

const server = require("./back/server");