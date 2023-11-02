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