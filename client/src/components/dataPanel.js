import React, { useState } from 'react'
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Alert, Button, Nav, Tab } from 'react-bootstrap';
import DataList from './data/dataList';
import { Database , Gear, FileEarmarkText, ArrowRepeat, Tools} from 'react-bootstrap-icons';
import ToolList from './tool/toolList';
import Report from './report/reportPanel';
import Axios  from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import {panelChange} from '../reducers/node'
import RunList from './run/runList';

const DataPanel = (props) => {
    const panel = useSelector(state => state.node.panel)
    const dispatch = useDispatch()
    const case_id = props.case_id
    const caseData = props.caseData
    const toolResult = props.toolResult
    const newData=props.newData
    const newRun = props.newRun
    const toolList = props.toolList
    
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
                            <Tools size="30px"/>
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
                <Tab.Content className='tw-ml-[-18px] tw-mr-[-5px] tw-h-[620px] tw-overflow-y-auto tw-overflow-x-hidden'>
                <Tab.Pane eventKey="data-list"><DataList case_id={case_id} caseData={caseData} newData={newData}/></Tab.Pane>
                <Tab.Pane eventKey="tool-list"><ToolList case_id={case_id} caseData={caseData} newRun={newRun} toolList={toolList}/></Tab.Pane>
                <Tab.Pane eventKey="run-list"><RunList case_id={case_id} toolResult={toolResult} /></Tab.Pane>
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