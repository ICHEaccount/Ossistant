import { Axios } from 'axios';
import React, { useEffect, useState } from 'react'
import { Tab } from 'react-bootstrap';
import Tabs from 'react-bootstrap/Tabs';
import RunCard from './runCard';
import { useSelector, useDispatch } from 'react-redux';
import {runViewChange} from '../../reducers/node'

const RunList = (props) => {
    const dispatch = useDispatch();
    const view = useSelector(state => state.node.runView)
    const case_id = props.case_id
    const status = ['ready','running',"completed","error"]
    const [runList, setrunList] = useState(props.toolResult)
    const [oldResults, setoldResults] = useState({
        "ready":[],
        "running":[],
        "completed":[],
        "error":[]
    })
    

    const runCards = status.map((status)=>{
        // console.log(runList);

        return <Tab eventKey={status} title={status}><RunCard runList = {runList[status].length?runList[status]:null} status={status}/></Tab>

    })

    return (
    <div>
    <Tabs variant='pills' justify activeKey={view} onSelect={(k)=>{dispatch(runViewChange(k))}}>
        {runCards}
    </Tabs>
    </div>
    )
}

export default RunList