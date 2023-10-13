
from neomodel import db, config

NEO4J_URL = 'bolt://neo4j:icheneo4j@172.25.0.4:7687'
config.DATABASE_URL = NEO4J_URL 
db.set_connection(NEO4J_URL)

