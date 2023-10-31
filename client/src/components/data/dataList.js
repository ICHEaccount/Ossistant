import  Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataCard from './dataCard';
import lbs,{category} from '../../labels';
import { Accordion, Card, Col, Nav, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import {labelChange,categoryChange} from '../../reducers/node'
import { Globe, InfoSquare, Person } from 'react-bootstrap-icons';


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
            return <Tab eventKey={label} title={label} >
                <DataCard nodes={caseData[label]!==undefined?caseData[label]:null} label={label} newData={newData[label]?newData[label]:null}/>
                </Tab>
        })
        return <Tab.Pane eventKey={tag} title={tag}>
            <Tabs activeKey={selcted_label} onSelect={(k)=>dispatch(labelChange(k))} justify>
                    {dataCardList}
            </Tabs>
        </Tab.Pane>
    })

    // const dataCardList=labels.map((label)=>{
    //     if (Object.keys(caseData).length!==0){
    //     const labelData = caseData[label]

    //     return labelData?<Tab eventKey={label} title={label}>
    //         <DataCard nodes={labelData} label={label} newData={newData[label]}/>
    //     </Tab>:<Tab eventKey={label} title={label}>
    //         <DataCard nodes={null} label={label} newData={null}/>
    //     </Tab>
    //     }
    //     else{
    //     return (<Tab eventKey={label} title={label}>
    //         <DataCard nodes={null} label={label} newData={newData}/>
    //     </Tab>)}
    // })


    return (
    <div>
        <Tab.Container>
        <Row>
        <Col sm={2}>
          <Nav variant="pills" className="flex-column  tw-border tw-rounded-md">
            <Nav.Item>
              <Nav.Link eventKey="Subject" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                <Person size="20px"/>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Site" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                <Globe size="20px"/>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Info" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                <InfoSquare size="20px"/>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={10} className='tw-mx-[-15px]'>
          <Tab.Content>
            {categoryList}
          </Tab.Content>
        </Col>
      </Row>
        </Tab.Container>
        {/* <Tabs variant='pills' activeKey={selected_category} justify className='mb-2' onSelect={(k)=>{dispatch(categoryChange(k))}}>
        {categoryList}
        </Tabs> */}

    </div>
    )
}

export default DataList