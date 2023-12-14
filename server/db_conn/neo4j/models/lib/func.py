from ...init import db
import re

def delete_nodes_by_case(case_id):
    try:
        query = """
            MATCH (n {case_id: $case_id})
            DETACH DELETE n
        """
        result, _ = db.cypher_query(query, {"case_id": case_id})

        return True, result
    except Exception as e:
        print(f"An error occurred: {e}")
        return False, str(e)
    

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
import re

def format_date_time(input_date):
    formats = ['%Y/%m/%d %H:%M', '%Y/%m/%d/ %H:%M', '%Y.%m.%d. %H:%M', '%Y.%m.%d %H:%M']
    format_flag = False
    output_format = '%Y-%m-%d %H:%M'

    # split_date = input_d.rsplit(' ', 1)
    # date_part = split_date[0]  
    # time_part = split_date[1]  
    # date_part = date_part.replace(' ','')  # Assign the result back to date_part
    # input_date = date_part + " "+ time_part    
    try:
        dt_underbar = datetime.strptime(input_date, '%Y-%m-%d %H:%M:%S')
        formatted_date = dt_underbar.strftime(output_format)
    except ValueError:
        format_flag = True
    
    if format_flag is True:
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
