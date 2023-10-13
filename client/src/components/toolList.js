import  Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataCard from './dataCard';
import lbs from '../labels';
import ToolCard from './toolCard';

const dummy = {
    "domain":[
        {"name":"whois",
        "id":"2222",
        "apply":["Domain"]}
    ]
    ,
    "user":[
        {"name":"osintagram",
        "id":"1111",
        "apply":["Username"]}
    ],
}

const ToolList = (props) => {
    const case_id = props.case_id
    const labels = Object.keys(lbs)
    const caseData = props.caseData
    const [tools, settools] = useState([])

    useEffect(() => {
        // Axios.get(`/tools/getToolList`)
        //     .then((res)=>{
        //     if(res.data){
        //         settools(res.data.data)
        //         setisLoad(true)
        //     }else{
        //         console.error(res.error);
        //         setisLoad(false)
        //     }
        //     })

        
        settools(dummy)
        
    }, [case_id])
    

    const toolList=labels.map((label)=>{
        const labelTools = tools[label]
        if (labelTools){
        return (<Tab eventKey={label} title={label}>
            <ToolCard labelTools={labelTools} labelData={caseData[label]} label={label} toolrunner={props.toolrunner} toolState={props.toolState}/>
        </Tab>)}
        else{
        return (<Tab eventKey={label} title={label}>
            <ToolCard labelTools={null} labelData={caseData[label]} label={label}/>
        </Tab>)}
    })


    return (
    <div>
        <Tabs>
        {toolList}
        </Tabs>

    </div>
    )
}

export default ToolList