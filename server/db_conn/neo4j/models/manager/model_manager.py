from typing import Any

# Node Decorator 
class NodeManager:
    def __init__(self, cls) -> None:
        self.cls = cls

    def get_node(self, node_id):
        return self.cls.nodes.get_or_none(uid=node_id)    
    
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
        node = self.cls.nodes.get_or_none(uid=node_id)
        if node:
            for key, value in kwargs.items():
                setattr(node, key, value)
            node.save()
            return node
        else:
            return None
    
    @classmethod
    def delete_node(self, node_id):
        node = self.cls.nodes.get_or_none(uid=node_id)
        if node:
            for rel in node.relationships.all():
                rel.delete()        
            node.delete()
            return True
        return False
    
    def get_all_nodes_list(self):
        nodes = self.cls.nodes.all()
        return [node.to_json() for node in nodes]
        
    def __call__(self, *args: Any, **kwds: Any) -> Any:
        setattr(self.cls, 'create_node', self.create_node)
        setattr(self.cls, 'get_uid', self.get_uid)
        setattr(self.cls, 'update_node_properties', self.update_node_properties)
        setattr(self.cls, 'get_node', self.get_node)
        setattr(self.cls, 'delete_node', self.delete_node)
        setattr(self.cls, 'get_all_nodes_list', self.get_all_nodes_list)
        return self.cls 
    