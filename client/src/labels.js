const labels = {
    "Post":{
        "title":"title",
        "category":"Site",
        "properties":["title","writer","url","content","created_date","note"],
        "list":[]
    },
    "Comment":{
        "title":"name",
        "category":"Site",
        "properties":["name","content","created_date","url"],
        "list":[]
    },
    "SurfaceUser":{
        "title":"username",
        "category":"Subject",
        "properties":["username","fake","note"],
        "list":[]

    },
    "DarkUser":{
        "title":"username",
        "category":"Subject",
        "properties":["username","rank","regdate","post_num","comment_num","note"],
        "list":[]
    },
    "Person":{
        "title":"name",
        "category":"Subject",
        "properties":["name","fake","note"],
        "list":[]
    },
    "Company":{
        "title":"name",
        "category":"Subject",
        "properties":["name","fake","business_num","note"],
        "list":[]
    },
    "Domain":{
        "title":"domain",
        "category":"Site",
        "properties":["domain","regdate","status","note"],
        "list":[]
    },
    "Phone":{
        "title":"number",
        "category":"Info",
        "properties":["number","note"],
        "list":[]
    },
    "Message":{
        "title":"sender",
        "category":"Info",
        "properties":["sender","content","date","note"],
        "list":[]
    },
    "Email":{
        "title":"email",
        "category":"Info",
        "properties":["email","fake","note"],
        "list":[]
    },
    "Wallet":{
        "title":"wallet",
        "category":"Info",
        "properties":["wallet","wallet_type","note"],
        "list":[]
    }
}

export const category = {
    "Subject":["SurfaceUser","DarkUser","Company","Person"],
    "Site":["Domain","Post","Comment"],
    "Info":["Email","Phone","Message","Wallet"],
}

export default labels