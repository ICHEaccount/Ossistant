import os
import sys 
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS

# Python Env
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from case import bp as case_bp
from db_conn.mongo.init import init_mongo

app = Flask(__name__)
CORS(app)


# Flask Config
load_dotenv()
app.config['MONGODB_DB'] = os.environ.get("MONGODB_DB")
app.config['MONGODB_HOST'] = os.environ.get('MONGODB_HOST')
app.config['MONGODB_PORT'] = int(os.environ.get('MONGODB_PORT'))
app.config['MONGODB_USERNAME'] = os.environ.get('MONGODB_USERNAME')
app.config['MONGODB_PASSWORD'] = os.environ.get('MONGODB_PASSWORD')

# DB setup
init_mongo(app)

# Register blueprint
app.register_blueprint(case_bp)

if __name__ == '__main__':
    app.run(host = '0.0.0.0', debug=True)