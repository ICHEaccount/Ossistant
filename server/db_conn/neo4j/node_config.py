from .models import *

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
    "SurfaceUser": [
        {
            "to": Post,
            "label" : "POST"
        },
        {
            "to" : Email,
            "label": "HAS"
        },
        {
            "to":Phone,
            "label":"HAS"
        }
    ],
    "DarkUser": [
        {
            "to": Post,
            "label" : "POST"
        },
        {
            "to" : Email,
            "label": "HAS"
        },
        {
            "to":Phone,
            "label":"HAS"
        }
    ],
    "Post": [
        {
            "from":SurfaceUser,
            "label": "POST"
        },
        {
            "from":DarkUser,
            "label":"POST"
        }
    ],
    "Email": [
        {
            "from":SurfaceUser,
            "label": "HAS"
        },
        {
            "from":DarkUser,
            "label":"HAS"
        }
    ],
    "Phone": [
        {
            "from":SurfaceUser,
            "label": "HAS"
        },
        {
            "from":DarkUser,
            "label":"HAS"
        }
    ]
}
