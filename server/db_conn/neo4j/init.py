# from neo4j import GraphDatabase
from py2neo import Graph
NEO4J_URI = "bolt://127.0.0.1:7687"  # Neo4j URI
NEO4J_USER = "neo4j"          # Neo4j username
NEO4J_PASSWORD = "icheneo4j"      # Neo4j password

graphdb = Graph(NEO4J_URI, user=NEO4J_USER, password=NEO4J_PASSWORD)
