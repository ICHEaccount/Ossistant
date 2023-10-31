import  Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataCard from './dataCard';
import lbs,{category} from '../../labels';
import { Accordion, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import {labelChange,categoryChange} from '../../reducers/node'


const DataList = (props) => {
    const selcted_label = useSelector(state => state.node.label)
    const selected_category = useSelector(state =>state.node.category)
    const dispatch = useDispatch()
    const case_id = props.case_id
    const labels = Object.keys(lbs)
    const caseData = props.caseData
    const newData = props.newData

    const categoryList = Object.keys(category).map((tag)=>{
        const list = category[tag]
        const dataCardList = list.map((label)=>{
            return <Accordion.Item eventKey={label}>
                <Accordion.Header>{label}</Accordion.Header>
                <Accordion.Body className='tw-mx-[-25px] tw-my-[-10px]'>
                <DataCard nodes={caseData[label]!==undefined?caseData[label]:null} label={label} newData={newData[label]?newData[label]:null}/>
                </Accordion.Body>
                </Accordion.Item>
        })
        return <Tab eventKey={tag} title={tag}>
            <Accordion activeKey={selcted_label} onSelect={(k)=>dispatch(labelChange(k))} flush>
                    {dataCardList}
            </Accordion>
        </Tab>
    })



    return (
    <div>
        <Tabs variant='pills' activeKey={selected_category} justify className='mb-2' onSelect={(k)=>{dispatch(categoryChange(k))}}>
        {categoryList}
        </Tabs>

    </div>
    )
}

export default DataList