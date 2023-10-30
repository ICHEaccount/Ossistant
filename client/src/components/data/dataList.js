import  Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataCard from './dataCard';
import lbs from '../../labels';
import { Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import {labelChange} from '../../reducers/node'


const DataList = (props) => {
    const label = useSelector(state => state.node.label)
    const dispatch = useDispatch()
    const case_id = props.case_id
    const labels = Object.keys(lbs)
    const caseData = props.caseData
    const newData = props.newData

    const dataCardList=labels.map((label)=>{
        if (Object.keys(caseData).length!==0){
        const labelData = caseData[label]

        return labelData?<Tab eventKey={label} title={label}>
            <DataCard nodes={labelData} label={label} newData={newData[label]}/>
        </Tab>:<Tab eventKey={label} title={label}>
            <DataCard nodes={null} label={label} newData={null}/>
        </Tab>
        }
        else{
        return (<Tab eventKey={label} title={label}>
            <DataCard nodes={null} label={label} newData={newData}/>
        </Tab>)}
    })


    return (
    <div>
        <Tabs activeKey={label} onSelect={(k)=>dispatch(labelChange(k))}>
        {dataCardList}
        </Tabs>

    </div>
    )
}

export default DataList