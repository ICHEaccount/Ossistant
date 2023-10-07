from flask_mongoengine import MongoEngine

db = MongoEngine()

def init_mongo(app):
    db.init_app(app)