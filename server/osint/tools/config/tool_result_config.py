from db_conn.neo4j.models import * 

"""
WHOIS 001
MAIGRET 003 

"""

CREATE_NODE = 0
UPDATE_PROPERTY = 1 

LABEL_DEFINE = 0


TOOL_RESULT_MATCH = {
    "01" : {
        'type': CREATE_NODE,
        'input_label' : Domain
    },
    "02" : {
        'type':UPDATE_PROPERTY
    },
    "03" : {
        'type': UPDATE_PROPERTY,
    },
    "04" : {
        'type':UPDATE_PROPERTY,
    }
    
    # "04": { # BTC
    #     'type':UPDATE_PROPERTY,
    #     'input_label':Wallet,
    #     'result_label' : Wallet ,
    #     'property': 'wallet',
    #     'db_property_name': 'address'
    # }
}