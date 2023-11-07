from .node import *
from ..init import db

TO = True
FROM = False

AUTO_RELATIONS = {
    "SurfaceUser":[
        {
            "to": Post,
            "data" : ["username","writer"],
            "label" : "POST"
        },
        {
            "from": Comment,
            "data" : ['username','name'],
            "label":"LEAVE_COMMENT"
        },
        
    ],
    "DarkUser":[
        {
            "to": Post,
            "data" : ["username","writer"],
            "label" : "POST"
        },
        {
            "from": Comment,
            "data" : ['username','name'],
            "label":"LEAVE_COMMENT"
        },
    ],
    "Post": [
        {
            "from": SurfaceUser,
            "data" : ["writer","username"],
            "label" : "POST"
        },
        {
            "from": DarkUser,
            "data" : ["writer","username"],
            "label" : "POST"
        },
        {
            "to": Comment,
            "data" : ["url","url"],
            "label" : "HAS_COMMENT"
        }
    ],
    "Comment":[
        {
            "from": Post,
            "data" : ["url","url"],
            "label" : "HAS_COMMENT"
        },
        {
            "to":SurfaceUser,
            "data" : ['name','username'],
            "label":"LEAVE_COMMENT"
        },
        {
            "to":DarkUser,
            "data" : ['name','username'],
            "label":"LEAVE_COMMENT"
        }
    ]
}

EXTENSION_RELATIONS = {
    "SurfaceUser":{
        "pos":"from",
        "label":"CONTAIN"
    },
    "Email": {
        "post":"to",
        "label":"HAS"
    },
    "Phone": {
        "post":"to",
        "label":"HAS"
    },
    "DarkUser":{
        "pos":"from",
        "label":"CONTAIN"
    }
}


class Relationship:

    @classmethod
    def create_relationship_by_uid(cls, from_uid, to_uid):
        if not from_uid or not to_uid:
            return False, 'uid did not exist'
        
        query = "MATCH (n)-[]-(m) WHERE n.uid = $from_uid SET m.uid = $to_uid RETURN labels(n), labels(m)"
        try:
            results, meta = db.cypher_query(query,{'from_uid':from_uid,'to_uid':to_uid})
            if results:
                from_label = results[0][0][0]
                to_label = results[0][1][0]
                if not from_label or not to_label:
                    return False, 'Node did not Exist'
                # get node 
                from_node = NODE_LIST[from_label].get_node({"uid":from_uid})
                to_node = NODE_LIST[to_label].get_node({"uid":to_uid})
                if from_node and to_node:
                    from_node.rel_to.connect(to_node,{'label':'NONE'})
                else:
                    return False, 'Node did not Exist'
                return True, 'Success'
        except Exception as e:
            return False, f"An error occurred: {e}"
        

    @classmethod
    def create_auto_relationship(cls, node, node_label):
        if node is not None:
            rels_list = AUTO_RELATIONS[node_label]
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

    @classmethod
    def delete_relationship(cls, uid):
        if not uid:
            return False, 'Relation uid did not exist'
        query = "MATCH ()-[r]-() WHERE r.uid = $uid DELETE r"
        try:
            results, meta = db.cypher_query(query, {'uid': uid})
            if results:
                return True, f"Success"
        except Exception as e:
            return False, f"An error occurred: {e}"
        return True, 'Relationship deleted successfully'

    @classmethod
    def modify_relationship(cls, uid, new_label):
        if not uid:
            return False, 'Relation uid did not exist'
        query = "MATCH ()-[r]-() WHERE r.uid = $uid SET r.label = $new_label RETURN r"
        try:
            results, meta = db.cypher_query(query, {'uid': uid, 'new_label': new_label})
            if results:
                return True, f"Success"
        except Exception as e:
            return False, f"An error occurred: {e}"