const routes = {};

function addRoute(key, callback) {
	routes[key] = callback;
}

async function useRoutes(req, res) {
	for(const key in routes) {
		if(req.url.includes(key)) {
			if(await routes[key](req, res)) {
				return true;
			}
		}
	}
	return false;
}

module.exports = { addRoute, useRoutes };