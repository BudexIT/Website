dev:
	cd public && python3 -m http.server 8080
deploy:
	cd public && python3 ../server.py