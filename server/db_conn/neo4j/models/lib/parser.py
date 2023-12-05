import re 
from urllib.parse import urlparse
# import phonenumbers
# from furl import furl 
# import tldextract as tld

from db_conn.neo4j.models import *

def parse_phone(content):
    parsed_numbers = re.findall(r'\b(?:\d{3}-?\d{3,4}-?\d{4})\b', content)
    if parsed_numbers:
        return parsed_numbers
    else:
        return None

def parse_email(content):
    emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', content)
    if emails:
        return emails
    else:
        return None

def parse_domain(content):
    parsed_domain = urlparse(content).netloc

    if parsed_domain:
        return parsed_domain
    else:
        return None

PARSE_CONFIG = {
    Phone : {
        "regex":r'\b(?:\d{3}-?\d{3,4}-?\d{4})\b',
        "key":'number'
    },
    Email : {
        "regex" : r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b',
        "key":'email'
    },
    Domain : {
        "regex": r'(?i)\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?""]))',
        "key": "domain"
    }
}


def content_parser(case_id, input_node, content):
    
    input_uid = input_node.uid
    parsed_data_list = list()

    for node_label, value in PARSE_CONFIG.items():
        error_msg = None
        if value['regex'] is None:
            data_list = parse_domain(content=content)
        else:
            data_list = re.findall(value['regex'], content)
        if not data_list:
            continue
        
        if isinstance(data_list[0],tuple):
            for parsed_data in data_list:
                parsed_data_list.append(parsed_data[0])
        else:
            parsed_data_list = data_list.copy()

        for parsed_data in parsed_data_list:
            # Create node 
            inp_data = {'case_id':case_id, value['key']:parsed_data}
            exist_flag, node = node_label.check_node(inp_data)
            if exist_flag is False:
                node = node_label.create_node(inp_data)
                input_node.rel_to.connect(node,{'label':'CONTENT_PARSER'})
            elif exist_flag is True:
                rel_check_flag, rel_result = Relationship.check_relationship(from_uid=input_uid, to_uid=node.uid)
                if rel_check_flag is True and rel_result is False:
                    input_node.rel_to.connect(node,{'label':'CONTENT_PARSER'})
                elif rel_check_flag is False:
                    error_msg = rel_result
                    break 
        if error_msg is not None:
            break
    if error_msg:
        return error_msg
    else:
        return True 

