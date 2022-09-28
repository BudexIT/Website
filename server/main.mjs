import fs from "fs";
import inquirer from "inquirer";

try {
	fs.readFileSync("private/users.json");
	startApp();
}
catch {
	console.log("Please create a user:");

	const questions = [
		{
			type: 'input',
			name: 'name',
			message: "Username:",
		},
		{
			type: 'password',
			name: 'pass',
			message: "Password:",
		}
	];
		
	inquirer.prompt(questions).then(answers => {
		console.log(`User created!`);

		const users = {};

		users[answers.name] = { pass: answers.pass, gid: 0 };

		const text = JSON.stringify(users);

		fs.writeFileSync("private/users.json", text);

		startApp();
	});
}

function startApp() {
	import("./back/server.js");
}