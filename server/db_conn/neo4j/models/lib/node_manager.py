from typing import Any
import copy

KEY_PROEPRTY = {
    "SurfaceUser":"username",
    "DarkUser":"username",
    "Post":"title",
    "Comment":"name",
    "Person":"name",
    "Company":"name",
    "Domain":"domain",
    "Phone" : "number",
    "Message" :"sender",
    "Email":"email",
    "Wallet":"wallet"
}
# Node Decorator 
class NodeManager:
    def __init__(self, cls) -> None:
        self.cls = cls

    def check_node(self, data):
        label = self.cls.__name__
        key_property = KEY_PROEPRTY[label]
        inp = dict()
        inp['case_id'] = data['case_id']
        if key_property in data:
            inp[key_property] = data[key_property]
            node = self.cls.nodes.first_or_none(**inp)
        else:
            data.pop('case_id')
            for key, value in data.items():
                if value is not None:
                    node = self.cls.nodes.first_or_none(**{key:value})
                    if node:
                        break 
        
        if node is not None:
            return True, node
        return False, None

    def get_node(self, data):
        node = self.cls.nodes.first_or_none(**data)
        if node:
            return node
        else:
            return None
    
    def get_all_nodes(self, case_id):
        nodes = self.cls.nodes.filter(case_id=case_id)
        return nodes
    
    def get_uid(self, data):
        node = self.cls.nodes.first_or_none(**data)
        if node:
            return node.uid
        else:
            return None
    
    def create_node(self , data):
        node = self.cls(**data)
        node.save()
        return node
    
    def update_node_properties(self, node_id, return_node=False, **kwargs):
        try:
            node = self.cls.nodes.first_or_none(uid=node_id)
            if node:
                for key, value in kwargs.items():
                    setattr(node, key, value)
                node.save()
                if return_node is True:
                    return True, node
                else: 
                    return True, "Success"
            else:
                return False, f"{self.cls.__name__} node did not exist"
        except Exception as e:
            return False, str(e)
    

    def delete_node(self, node_id):
        node = self.cls.nodes.first_or_none(uid=node_id)
        if node:
            for rel in node.relationships.all():
                rel.delete()        
            node.delete()
            return True
        return False
    
    def get_all_nodes_list(self, case_id, is_uid = True):
        try:
            nodes = self.cls.nodes.filter(case_id=case_id)
            if not nodes:
                return True, []
            
            if is_uid is True:
                return True, [node.to_json() for node in nodes]
            else:
                output = []
                for node in nodes:
                    node_info = dict()
                    node_info['property'] = dict()
                    for key,value in node.to_json().items():
                        if key == 'uid':
                            node_info['node_id'] = value
                        else:
                            node_info['property'][key]= value
                    output.append(node_info)
                return True, output

        except Exception as e:
            return False, str(e)

    def node_exists_url(self,case_id, url):
        try:
            node = self.cls.nodes.filter(case_id=case_id, url=url).first()
            return True, node.uid 
        except self.cls.DoesNotExist as e:
            return False, str(e)
    
    def get_node_name(self):
        return self.cls.__name__
    
    def __call__(self, *args: Any, **kwds: Any) -> Any:
        setattr(self.cls, 'create_node', self.create_node)
        setattr(self.cls, 'get_uid', self.get_uid)
        setattr(self.cls, 'update_node_properties', self.update_node_properties)
        setattr(self.cls, 'get_node', self.get_node)
        setattr(self.cls, 'get_all_nodes', self.get_all_nodes)
        setattr(self.cls, 'delete_node', self.delete_node)
        setattr(self.cls, 'get_all_nodes_list', self.get_all_nodes_list)
        setattr(self.cls, 'check_node',self.check_node)
        setattr(self.cls, 'node_exists_url',self.node_exists_url)
        setattr(self.cls, 'get_node_name', self.get_node_name)
        return self.cls 
    