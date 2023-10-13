import os
import sys 

from flask import Flask, Blueprint
from flask_cors import CORS
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from db_conn.mongo.init import init_mongo
from relation.ext import bp as ext_bp
from relation.graph import bp as graph_bp
from case.case import bp as case_bp


app = Flask(__name__)
CORS(app)

# MongoDB
load_dotenv()
app.config['MONGODB_DB'] = os.environ.get("MONGODB_DB")
app.config['MONGODB_HOST'] = os.environ.get('MONGODB_HOST')
app.config['MONGODB_PORT'] = int(os.environ.get('MONGODB_PORT'))
app.config['MONGODB_USERNAME'] = os.environ.get('MONGODB_USERNAME')
app.config['MONGODB_PASSWORD'] = os.environ.get('MONGODB_PASSWORD')
init_mongo(app)



app.register_blueprint(ext_bp)
app.register_blueprint(case_bp)
app.register_blueprint(graph_bp)

if __name__ == '__main__':
    app.run(host = '0.0.0.0', debug=True, port=5000)
