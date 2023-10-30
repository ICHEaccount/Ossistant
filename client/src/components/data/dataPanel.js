import React, { useState } from 'react'
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Alert, Button, Nav, Tab } from 'react-bootstrap';
import DataList from './dataList';
import { Database , Gear, FileEarmarkText, ArrowRepeat} from 'react-bootstrap-icons';
import ToolList from '../tool/toolList';
import Report from '../report';
import Axios  from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import {panelChange} from '../../reducers/node'
import RunList from '../run/runList';

const DataPanel = (props) => {
    const panel = useSelector(state => state.node.panel)
    const dispatch = useDispatch()
    const case_id = props.case_id
    const caseData = props.caseData
    const toolrunner = props.toolrunner
    const toolState = props.toolState
    const newData=props.newData
    
    const LeftTabs = () => {
        return (
        <Tab.Container id="left-tabs-example" activeKey={panel} onSelect={(k)=>{dispatch(panelChange(k))}}>
            <Row>
            <Col sm={3} className=''>
                <Nav variant="pills" fill justify className="flex-column p-1 tw-border tw-rounded-md">
                    <Nav.Item>
                    <Nav.Link eventKey="data-list" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                            <Database size="30px" />
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="tool-list" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                            <Gear size="30px"/>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="run-list" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                            <ArrowRepeat size="30px"/>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="report" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                            <FileEarmarkText size="30px"/>                        
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Col>
            <Col sm={9}>
                <Tab.Content>
                <Tab.Pane eventKey="data-list"><DataList case_id={case_id} caseData={caseData} newData={newData}/></Tab.Pane>
                <Tab.Pane eventKey="tool-list"><ToolList case_id={case_id} caseData={caseData} toolState={toolState} toolrunner={toolrunner}/></Tab.Pane>
                <Tab.Pane eventKey="run-list"><RunList case_id={case_id} caseData={caseData} toolState={toolState} toolrunner={toolrunner}/></Tab.Pane>
                <Tab.Pane eventKey="report"><Report case_id={case_id} caseData={caseData}/></Tab.Pane>
                </Tab.Content>
            </Col>
            </Row>
        </Tab.Container>
        );
    }
    

    return (
        <LeftTabs/>
    )
}

export default DataPanel