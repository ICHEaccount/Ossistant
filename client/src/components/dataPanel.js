import React, { useState } from 'react'
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Alert, Button, Nav, Tab } from 'react-bootstrap';
import DataList from '../components/dataList';
import { Database , Gear, FileEarmarkText} from 'react-bootstrap-icons';
import ToolList from './toolList';
import Report from './report';
import { Axios } from 'axios';


const DataPanel = (props) => {
    const case_id = props.case_id
    const caseData = props.caseData
    const [toolState, settoolState] = useState("none")
    const [toolResult, settoolResult] = useState([])
    const [toolError, settoolError] = useState({})
    const [show, setShow] = useState(true);

    const toolrunner = (run_id) =>{
        const interval = setInterval(() => {
            // Axios.get(`/tools/getToolState/${run_id}`)
            //     .then(response => {
            //     if (response.data.state === 'completed') {
            //         clearInterval(interval); // 작업이 완료되면 인터벌 해제
            //         settoolResult(response.data.result);
            //         settoolState('completed');
            //     } else if (response.data.state === 'running') {
            //         settoolState('running');
            //     } else {
            //         clearInterval(interval);
            //         settoolState('unknown');
            //     }
            //     })
            //     .catch(error => {
            //     clearInterval(interval);
            //     settoolState('error');
            //     settoolError(error)
            //     });
          }, 5000); // 5초마다 확인
    }

    const ResultBanner = () =>{
        switch (toolState) {
            case "completed":
                return(
                <Alert show={show} variant="success" >
                    <Alert.Heading>Success</Alert.Heading>
                    <p>
                        {toolResult.newData?toolResult.newData:"But Nothing acquired"}
                    </p>
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => setShow(false)} variant="outline-success">
                        Got It
                        </Button>
                    </div>
                </Alert>
                )
            case "running":
                return(
                    <Alert show={true} variant="light">
                        Tool Running...
                    </Alert>
                    )
            case "error":
                return(
                    <Alert show={show} variant="danger" dismissible>
                        Error Occured During Running Tools
                        <p>
                            {toolError.error?toolError.error:"Something went wrong:("}
                        </p>
                        <div className="d-flex justify-content-end">
                        <Button onClick={() => setShow(false)} variant="outline-danger">
                        Got It
                        </Button>
                    </div>
                    </Alert>
                    )
            default:
                return null;
        }
    }

    const LeftTabs = () => {
        return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="data-list">
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
                        <Nav.Link eventKey="report" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                            <FileEarmarkText size="30px"/>
                        
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Col>
            <Col sm={9}>
                <Tab.Content>
                <ResultBanner/>
                <Tab.Pane eventKey="data-list"><DataList case_id={case_id} caseData={caseData}/></Tab.Pane>
                <Tab.Pane eventKey="tool-list"><ToolList case_id={case_id} caseData={caseData} toolState={toolState} toolrunner={toolrunner}/></Tab.Pane>
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