import json 
import re 
import subprocess
import requests

from flask import Flask, request
from flask_cors import CORS

from whois import bp as whois_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(whois_bp)

if __name__ == '__main__':
    app.run(host = '0.0.0.0', debug=True)