dev:
	cd public && python3 -m http.server 80
deploy:
	cd public && python3 ../server.py