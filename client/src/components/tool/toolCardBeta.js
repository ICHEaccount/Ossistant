import React, { useRef, useState } from 'react';
import { Button, Card, Container, Form, FormCheck, ListGroup, ListGroupItem, Overlay, Tooltip } from 'react-bootstrap';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { ChevronLeft, ChevronRight, List, Play } from 'react-bootstrap-icons';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import {viewChange} from '../../reducers/node'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';


const ToolCardBeta = (props) => {
    const dispatch = useDispatch()
    const tools = props.labelTools;
    const labelData = props.labelData;
    const case_id = props.case_id;
    const label = props.label;
    const [selectedEventKey, setSelectedEventKey] = useState('list');
    // const [selectedItems, setSelectedItems] = useState({});
    const [selectedValue, setselectedValue] = useState(labelData&&labelData.length&&tools?{node:labelData[0].node_id,value:labelData[0].property[tools[0].apply[0]],key:tools[0].apply[0]}:{node:null,value:null,key:null})
    const [show, setshow] = useState(false)
    const runButton = useRef(null)


    const runTool = () => {
        // e.preventDefault();

        if (selectedValue.node===null) {
            setshow(!show)
            return;
        }

        console.log(selectedValue);

        const selectedTool = tools.find((tool, idx) => selectedEventKey === `selected-${idx}`);
        // console.log(selectedTool);
        const intoArray = []
        intoArray.push({node_id:selectedValue.node,property:[{[selectedValue.key]:selectedValue.value}]})
        const selectedNodes = {
            case_id: case_id,
            tool_id: selectedTool.tool_id,
            input_node:selectedValue.node,
            properties: intoArray
        };

        console.log(selectedNodes);

        Axios.post('/tools/runTools', selectedNodes)
            .then((response) => {
                console.log(response.data);
                // props.newRun(true)
                props.newRun((prev)=> [...prev,response.data.run_id])
                dispatch(viewChange('list'))
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const toolList = tools?.map((tool, idx) => {
        // console.log(tools);
        return (
            <Card className="mt-1" key={tool.name}>
                <Card.Body>
                    <Row>
                        <Col xs="10">{tool.name}</Col>
                        <Col xs="2" className="d-flex align-items-center">
                            <ChevronRight className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-white' size={20} onClick={()=>setSelectedEventKey(`selected-${idx}`)}/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    });

    const selectedNode = tools?.map((tool, idx) => {
        return selectedEventKey === `selected-${idx}` ? (
                <Card className="mt-1 tw-w-full">
                    <Card.Header className='mb-1 tw-bg-bright-peach'>
                        <ChevronLeft className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-bright-peach  ' size={20} onClick={()=>setSelectedEventKey('list')}/>
                        {tool.name}
                    </Card.Header>
                    <Card.Body>
                    <Card.Subtitle className='text-muted tw-mb-0.5'>
                            {tool.desc}
                    </Card.Subtitle>
                    <ListGroup className='tw-border-0'>
                        <ListGroupItem className='tw-border-0'>
                        {labelData?.length ? (
                            <Form onSubmit={runTool}>
                                {tool.apply.map((p, idx) => (
                                    <Form.Group key={idx}>
                                        <Form.Label>{p}</Form.Label>
                                        {labelData.map((node, idx) => {
                                            // console.log(labelData);
                                            if (p in node.property) {
                                                return (
                                                    <FormCheck> 
                                                    <FormCheckInput  
                                                        key={`${node.node_id}-${p}`}
                                                        type="radio"
                                                        checked={selectedValue.node===node.node_id}
                                                        // checked={selectedItems[node.node_id] && selectedItems[node.node_id][p]}
                                                        onChange={() => setselectedValue({node:node.node_id,value:node.property[p], key:p})}
                                                    />
                                                    <FormCheckLabel className='tw-inline'>{node.property[p]}</FormCheckLabel>
                                                    </FormCheck>
                                                );
                                            } else return `require ${p}`;
                                        })}
                                    </Form.Group>
                                ))}
                                <div className='tw-flex tw-justify-end'>
                                <div onClick={runTool} ref={runButton} className='tw-bg-bright-peach hover:tw-bg-peach hover:tw-text-bright-peach tw-border-0 hover:tw-cursor-pointer tw-fill-peach tw-text-peach tw-p-1 tw-pl-2  tw-rounded-md'>
                                    Run <Play className=' tw-inline' size={25}/>
                                    {selectedValue?null:(<Overlay target={runButton.current} show={show} placement="right">
                                    {(props) => (
                                        <Tooltip id="overlay-example" {...props}>
                                        No item selected
                                        </Tooltip>
                                    )}
                                    </Overlay>)}
                                    </div>
                                </div>
                                
                            </Form>
                        ) : <p className='tw-text-peach tw-text-center'>{`No ${label} Data Available`}</p>}
                        </ListGroupItem>
                    </ListGroup>
                        
                    </Card.Body>
                </Card>
        ) : null;
    });

    return (
        <Container>
            {selectedEventKey === 'list' ? (tools?toolList:<p className='tw-text-center'>no tools yet</p>) : selectedNode}
        </Container>
    );
};

export default ToolCardBeta;
