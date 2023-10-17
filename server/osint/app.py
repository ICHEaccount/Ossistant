import os
import sys 

from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from db_conn.mongo.init import init_mongo
from tools.tool import bp as tool_bp

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


app.register_blueprint(tool_bp)

if __name__ == '__main__':
    app.run(host = '0.0.0.0', debug=True)