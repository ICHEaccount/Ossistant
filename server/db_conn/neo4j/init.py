import GraphDatabase

def connect_neo4j():
    driver = GraphDatabase.driver('bolt://172.25.0.2:7687', auth=('neo4j', 'icheneo4j'))
    return driver