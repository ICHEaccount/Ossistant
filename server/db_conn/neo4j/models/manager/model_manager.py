from typing import Any


# Node Decorator 
class NodeManager:
    def __init__(self, cls) -> None:
        self.cls = cls

    def check_node(self, data):
        node = self.cls.nodes.get_or_none(**data)
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
        node = self.cls.nodes.get_or_none(**data)
        if node:
            return node.uid
        else:
            return None
    
    def create_node(self , data):
        node = self.cls(**data)
        node.save()
        return node
    
    def update_node_properties(self, node_id, **kwargs):
        try:
            node = self.cls.nodes.get_or_none(uid=node_id)
            if node:
                for key, value in kwargs.items():
                    setattr(node, key, value)
                node.save()
                return True, "Success"
            else:
                return False, f"{self.cls.__name__} node did not exist"
        except Exception as e:
            return False, str(e)
    

    def delete_node(self, node_id):
        node = self.cls.nodes.get_or_none(uid=node_id)
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
        return self.cls 
    