const labels = {
    "Post":{
        "title":"title",
        "category":"Site",
        "properties":[
            {
                "property":"title",
                "name": "Title",
                "inputType": "text",
                "as":"input"
            },
            {
                "property":"writer",
                "name": "Writer",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"created_date",
                "name": "Created Date",
                "inputType":"datetime-local",
                "as":"input"
            },
            {
                "property":"url",
                "name": "URL",
                "inputType": "url",
                "as":"input"
            },
            {
                "property":"content",
                "name": "Content",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
        ],
        "list":[]
    },
    "Comment":{
        "title":"content",
        "category":"Site",
        "properties":[
            {
                "property":"name",
                "name": "Writer",
                "inputType": "text",
                "as":"input"
            },
            {
                "property":"created_date",
                "name": "Created Date",
                "inputType":"datetime-local",
                "as":"input"
            },
            {
                "property":"url",
                "name": "URL",
                "inputType": "url",
                "as":"input"
            },
            {
                "property":"content",
                "name": "Content",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
        ],
        "list":[]
    },
    "SurfaceUser":{
        "title":"username",
        "category":"Subject",
        "properties":[
            {
                "property":"username",
                "name": "Username",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"imposter",
                "name": "Imposter",
                "inputType":"select",
                "as":"select",
                "option":["None","Yes","No"]
            },
            {
                "property":"registered",
                "name": "Registered",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
            ],
        "list":["registered"]

    },
    "DarkUser":{
        "title":"username",
        "category":"Subject",
        "properties":[
            {
                "property":"username",
                "name": "Username",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"imposter",
                "name": "Imposter",
                "inputType":"select",
                "as":"select",
                "option":["None","Yes","No"]
            },
            {
                "property":"rank",
                "name": "Rank",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"regdate",
                "name": "Register Date",
                "inputType":"datetime-local",
                "as":"input"
            },
            {
                "property":"post_num",
                "name": "Post",
                "inputType":"number",
                "as":"input"
            },
            {
                "property":"comment_num",
                "name": "Comment",
                "inputType":"number",
                "as":"input"
            },
            {
                "property":"registered",
                "name": "Registered",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
            ],
        "list":["registered"]
    },
    "Person":{
        "title":"name",
        "category":"Subject",
        "properties":[
            {
                "property":"name",
                "name": "Name",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"imposter",
                "name": "Imposter",
                "inputType":"select",
                "as":"select",
                "option":["None","Yes","No"]
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
            ],
        "list":[]
    },
    "Company":{
        "title":"name",
        "category":"Subject",
        "properties":[
            {
                "property":"name",
                "name": "Name",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"imposter",
                "name": "Imposter",
                "inputType":"select",
                "as":"select",
                "option":["None","Yes","No"]
            },
            {
                "property":"business_num",
                "name": "Business Number",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"location",
                "name": "Location",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
            ],
        "list":[]
    },
    "Domain":{
        "title":"domain",
        "category":"Site",
        "properties":[
            {
                "property":"domain",
                "name": "Domain",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"regdate",
                "name": "Register Date",
                "inputType":"datetime-local",
                "as":"input"
            },
            {
                "property":"status",
                "name": "Status",
                "inputType":"select",
                "as":"select",
                "option":["None","Active","Inactive"]
            },
            {
                "property":"leaked",
                "name": "Leaked",
                "inputType":"select",
                "as":"select",
                "option":["None","Yes","No"]
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
            ],
        "list":[]
    },
    "Phone":{
        "title":"number",
        "category":"Info",
        "properties":[
            {
                "property":"number",
                "name": "Number",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"imposter",
                "name": "Imposter",
                "inputType":"select",
                "as":"select",
                "option":["None","Yes","No"]
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
            ],
        "list":[]
    },
    "Message":{
        "title":"sender",
        "category":"Info",
        "properties":[
            {
                "property":"sender",
                "name": "Sender",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"date",
                "name": "Date",
                "inputType":"datetime-local",
                "as":"input"
            },
            {
                "property":"content",
                "name": "Content",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
        ],
        "list":[]
    },
    "Email":{
        "title":"email",
        "category":"Info",
        "properties":[
            {
                "property":"email",
                "name": "Email",
                "inputType":"email",
                "as":"input"
            },
            {
                "property":"leaked",
                "name": "Leaked",
                "inputType":"select",
                "as":"select",
                "option":["None","Yes","No"]
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
        ],
        "list":[]
    },
    "Wallet":{
        "title":"wallet",
        "category":"Info",
        "properties":[
            {
                "property":"wallet",
                "name": "Address",
                "inputType":"text",
                "as":"input"
            },
            {
                "property":"wallet_type",
                "name": "Type",
                "inputType":"select",
                "as":"select",
                "option":["None","BTC","ETH","USDT","BNB","XRP","Others"]
            },
            {
                "property":"note",
                "name": "Note",
                "inputType":"textarea",
                "as":"textarea"
            },
            {
                "property":"others"
            }
            ],
        "list":[]
    }
}

export const category = {
    "Subject":["SurfaceUser","DarkUser","Company","Person"],
    "Site":["Domain","Post","Comment"],
    "Info":["Email","Phone","Message","Wallet"],
}

export default labels