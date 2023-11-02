import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Tab } from 'react-bootstrap';
import Tabs from 'react-bootstrap/Tabs';
import RunCard from './runCard';

const dummy = {
    "running":[
        {
            run_id:"003",
            runtime:"23-09-05",
            tool_id:"1",
            tool_name:"whois",
            input_value:"puritipo.co.kr",
            results:[]
        }
    ],
    "completed":[
        {
            run_id:"001",
            runtime:"23-09-05",
            tool_id:"1",
            tool_name:"whois",
            input_value:"google.com",
            results:[{
                result_id:"000",
                result:{"registant":"John"},
                created:false
            }]
        }
    ],
    "error":[
        {
            run_id:"002",
            runtime:"23-09-05",
            tool_id:"1",
            tool_name:"whois",
            input_value:"example.com",
            results:[{
                result_id:"000",
                result:{"error":"Something Went Wrong:("},
                created:false
            }]
        }
    ]
}

const RunList = (props) => {
    const case_id = props.case_id
    const status = ['running',"completed","error"]
    const [runList, setrunList] = useState(dummy)

    // useEffect(() => {
    //     axios.get(`/tool/getRunList/${case_id}`)
    //     .then((res)=>{
    //         setrunList(res.data)
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })
    // }, [])
    

    const runCards = status.map((status)=>{
        if(runList[status]){
            return <Tab eventKey={status} title={status}><RunCard runList = {runList[status]} status={status}/></Tab>
        } else {
            return <Tab eventKey={status} title={status}><RunCard runList = {null} status={status} /></Tab>
        }
    })

    return (
    <div>
    <Tabs >
        {runCards}
    </Tabs>
    </div>
    )
}

export default RunList