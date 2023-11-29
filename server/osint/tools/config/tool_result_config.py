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
        'input_label': None,
        'result_label' : None,
        'property': 'registered',
        'db_property_name' : None
    },
    # Sample for create_node mode 
    "04": {
        'type':CREATE_NODE,
        'input_label':SurfaceUser,
        'result_label' : Wallet,
        'property': 'wallet',
        'db_property_name': None
    }
}