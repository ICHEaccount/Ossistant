import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Tab } from 'react-bootstrap';
import Tabs from 'react-bootstrap/Tabs';
import RunCard from './runCard';

const RunList = (props) => {
    const case_id = props.case_id
    const states = ['running',"completed","error"]
    const [runList, setrunList] = useState([])

    // useEffect(() => {
    //     axios.get(`/tool/getRunList/${case_id}`)
    //     .then((res)=>{
    //         setrunList(res.data)
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })
    // }, [])
    

    // const runCards = states.map((state)=>{
    //     if(runList[state]){
    //         return <RunCard runList = {runList[state]}/>
    //     } else {
    //         return <RunCard runList = {null} />
    //     }
    // })

    return (
    <div>
    <Tabs >
        {/* {runCards} */}
    </Tabs>
    </div>
    )
}

export default RunList