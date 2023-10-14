import  Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataCard from './dataCard';
import lbs from '../labels';
import { Card } from 'react-bootstrap';



const DataList = (props) => {
    const case_id = props.case_id
    const labels = Object.keys(lbs)
    const caseData = props.caseData

    // console.log(caseData);

    const dataCardList=labels.map((label)=>{
        // console.log(caseData);
        if (Object.keys(caseData).length!==0){
        const labelData = caseData[label]
        console.log(label,labelData);
        return labelData?<Tab eventKey={label} title={label}>
            <DataCard nodes={labelData} label={label}/>
        </Tab>:<Tab eventKey={label} title={label}>
            <DataCard nodes={null} label={label}/>
        </Tab>
        }
        else{
        return (<Tab eventKey={label} title={label}>
            <DataCard nodes={null} label={label}/>
        </Tab>)}
    })


    return (
    <div>
        <Tabs>
        {dataCardList}
        </Tabs>

    </div>
    )
}

export default DataList