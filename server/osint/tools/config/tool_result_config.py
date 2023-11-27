from db_conn.neo4j.models import * 

"""
WHOIS 001
MAIGRET 003 

"""

CREATE_NODE = 0
UPDATE_PROPERTY = 1 

TOOL_RESULT_MATCH = {
    "03" : {
        'type': UPDATE_PROPERTY,
        'input_label': SurfaceUser,
        'result_label' : SurfaceUser,
        'property': 'registered',
        'db_name' : 'site'
    }
}