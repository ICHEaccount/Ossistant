import  Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import lbs from '../labels';
import ToolCard from './toolCard';
import Loading from './loading';

const dummy = {
    "Domain":[
        {"name":"whois",
        "id":"01",
        "apply":["domain"]}
    ]
    ,
    "SurfaceUser":[
        {"name":"osintagram",
        "id":"02",
        "apply":["username"]}
    ],
}

const ToolList = (props) => {
    const case_id = props.case_id
    const labels = Object.keys(lbs)
    const caseData = props.caseData
    const [isload, setIsload] = useState(false)
    const [tools, settools] = useState([])

    useEffect(() => {
        // Axios.get(`/tools/getToolList`)
        //     .then((res)=>{
        //     if(res.data){
        //         settools(res.data.data)
        //         setIsload(true)
        //     }else{
        //         console.error(res.error);
        //         setIsload(false)
        //     }
        //     })
        settools(dummy)
    }, [case_id])
    

    const toolList=labels.map((label)=>{
        if(Object.keys(caseData).length===0) return (
            <Tab eventKey={label} title={label}>
                <p className='tw-text-center tw-text-lg'>No Data Yet</p>
            {/* <ToolCard case_id={case_id} labelTools={labelTools!==undefined?labelTools:null} labelData={caseData[label]} label={label} toolrunner={props.toolrunner} toolState={props.toolState}/> */}
            </Tab>
            )
        const labelTools = tools[label]
        // console.log(labelTools);
        // if(labelTools!==undefined) console.log(labelTools);
        return (
            <Tab eventKey={label} title={label}>
            <ToolCard case_id={case_id} labelTools={labelTools!==undefined?labelTools:null} labelData={caseData[label]} label={label} toolrunner={props.toolrunner} toolState={props.toolState}/>
            </Tab>
            )
            
    
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