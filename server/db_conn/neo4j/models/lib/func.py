from ...init import db

def delete_node(node_id):
    try:
        query = """
            MATCH (n {uid: $node_id})
            OPTIONAL MATCH (n)-[r1]->()
            OPTIONAL MATCH ()-[r2]->(n)
            DELETE r1, r2, n
        """
        results, _ = db.cypher_query(query, {"node_id": node_id})
        return True, results
    except Exception as e:
        print(f"An error occurred: {e}")
        return False, str(e)

