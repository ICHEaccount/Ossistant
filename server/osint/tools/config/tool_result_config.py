from db_conn.neo4j.models import * 

"""
WHOIS 001
MAIGRET 003 

"""

CREATE_NODE = 0
UPDATE_PROPERTY = 1 

LABEL_DEFINE = 0


TOOL_RESULT_MATCH = {
    "02" : {
        'type' : CREATE_NODE,
        'input_label' : Domain,
        'result_label': LABEL_DEFINE,
        'property' : 'domain',
        'db_property_name' : 'subdomain'
    },
    "03" : { # 
        'type': UPDATE_PROPERTY,
        'input_label': None,
        'result_label' : None,
        'property': 'registered',
        'db_property_name' :'site'
    },
    # "04": { # BTC
    #     'type':UPDATE_PROPERTY,
    #     'input_label':Wallet,
    #     'result_label' : Wallet ,
    #     'property': 'wallet',
    #     'db_property_name': 'address'
    # }
}