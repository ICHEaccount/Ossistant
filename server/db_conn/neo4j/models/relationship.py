from .node import *

TO = True
FROM = False

NODE_LIST = {
    'Domain': Domain,
    'SurfaceUser': SurfaceUser,
    'Post': Post,
    'DarkUser': DarkUser,
    'Person': Person,
    'Company': Company,
    'Comment': Comment,
    'Email': Email,
    'Wallet': Wallet,
    'Phone': Phone,
    'Message': Message
}

RELATIONS = {
    "SurfaceUser":[
        {
            "to": Post,
            "data" : ["username","writer"],
            "label" : "POST"
        }
    ],
    "Post": [
        {
            "from": SurfaceUser,
            "data" : ["writer","username"],
            "label" : "POST"

        }
    ]
       
}

class Relationship:
    @classmethod
    def create_relationship(cls, node, node_label):
        if node is not None:
            rels_list = RELATIONS[node_label]
            for rel_info in rels_list:
                pos_flag = TO
                rel_data = rel_info['data']

                pos_key = list(rel_info.keys())[0]
                if hasattr(node, rel_data[0]):
                    if pos_key == 'to':
                        node2 = rel_info['to'].get_node({rel_data[1]:getattr(node, rel_data[0])})
                    elif pos_key == 'from':
                        node2 = rel_info['from'].get_node({rel_data[1]:getattr(node, rel_data[0])})
                        pos_flag = FROM 
                    else:
                        return False,'Invalid node_config'
                else:
                    return True, 'Success'
                
                if node2:
                    if pos_flag is TO:
                        node.rel_to.connect(node2,{'label':node_label})
                    else:
                        node2.rel_to.connect(node,{'label':node_label})
            return True, 'Success'
        else:
            return False, 'Node does not exist'

