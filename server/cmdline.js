// Preparse Key-Value pairs
const preparsedLong = {};
const preparsedShort = {};
(() => {
	for(const arg of process.argv) {
		// if it starts with -- it's a long-name argument
		if(arg.slice(0,2) == "--") {
			const keyval = arg.slice(2, arg.length).split('=');
			if(keyval[1]) {
				preparsedLong[keyval[0]] = keyval[1];
			}
			else {
				preparsedLong[keyval[0]] = true;
			}
		}
		// if it starts with - it's a short-name argument
		else if(arg[0] == "-") {
			const keyval = arg.slice(1, arg.length).split('=');
			if(keyval[1]) {
				preparsedShort[keyval[0]] = keyval[1];
			}
			else {
				preparsedShort[keyval[0]] = true;
			}
		}
	}
})();

function descriptor(longName, shortName, defaultValue, description) {
	return {longName, shortName, defaultValue, description};
}

function describe(descriptorList) {
	if(preparsedLong["help"] || preparsedShort["h"]) {
		console.log("List of available parameters:");
		console.log("   Example of usage: `--parameter=value`");
		console.log("");
		for(const desc of descriptorList) {
			console.log(`--${desc.longName} or -${desc.shortName} (defaults to "${desc.defaultValue}")`);
			console.log(`   ${desc.description}`);
		}

		process.exit();
	}
}

function arg(longName, shortName, defaultValue) {
	if(preparsedLong[longName]) {
		return preparsedLong[longName];
	}
	else if(preparsedShort[shortName]) {
		return preparsedShort[shortName];
	}
	else {
		return defaultValue;
	}
}

module.exports = {arg, describe, descriptor};