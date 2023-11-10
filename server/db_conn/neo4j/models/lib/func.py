from ...init import db

def delete_node(node_id):
    try:
        query = """
        MATCH (n {uid: $node_id})
        OPTIONAL MATCH (n)-[r]-()
        DELETE n, r
        """
        results, _ = db.cypher_query(query, {"node_id": node_id})
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

