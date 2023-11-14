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

from datetime import datetime

def format_date_time(input_date):
    formats = ['%Y/%m/%d %H:%M', '%Y/%m/%d/ %H:%M', '%Y.%m.%d. %H:%M', '%Y.%m.%d %H:%M']

    output_format = '%Y-%m-%d %H:%M'
    formatted_date = None
    for fmt in formats:
        try:
            dt = datetime.strptime(input_date, fmt)
            formatted_date = dt.strftime(output_format)
            break
        except ValueError:
            continue

    if formatted_date:
        return formatted_date
    else:
        return None