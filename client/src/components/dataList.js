import  Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataCard from './dataCard';
import lbs from '../labels';
import CreateData from './createData';
import { Card } from 'react-bootstrap';



const DataList = (props) => {
    const case_id = props.case_id
    const labels = Object.keys(lbs)
    const caseData = props.caseData

    

    const dataCardList=labels.map((label)=>{

        if (caseData){
        const labelData = caseData[label]

        return (<Tab eventKey={label} title={label}>
            <DataCard nodes={labelData} label={label}/>
        </Tab>)}
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