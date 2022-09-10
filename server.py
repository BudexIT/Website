#!/usr/bin/python
import http.server
import ssl

httpd =  http.server.HTTPServer(('0.0.0.0', 8443), http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket, certfile='/etc/letsencrypt/live/budexit.wroclaw.pl/fullchain.pem', keyfile='/etc/letsencrypt/live/budexit.wroclaw.pl/privkey.pem')
httpd.serve_forever()