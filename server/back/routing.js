const routes = {};

function addRoute(key, callback) {
	routes[key] = callback;
}

function useRoutes(req, res) {
	for(const key in routes) {
		if(req.url.includes(key)) {
			if(routes[key](req, res)) {
				return true;
			}
		}
	}
	return false;
}

module.exports = { addRoute, useRoutes };