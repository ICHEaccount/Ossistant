import React, { useRef, useState } from 'react';
import { Button, Card, Container, Form, Overlay, Tooltip } from 'react-bootstrap';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { ChevronLeft, ChevronRight, Play } from 'react-bootstrap-icons';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import {viewChange} from '../../reducers/node'


const ToolCard = (props) => {
    const dispatch = useDispatch()
    const tools = props.labelTools;
    const labelData = props.labelData;
    const case_id = props.case_id;
    const [selectedEventKey, setSelectedEventKey] = useState('list');
    const [selectedItems, setSelectedItems] = useState({});
    const [show, setshow] = useState(false)
    const runButton = useRef(null)

    // console.log(labelData);

    const toggleItemSelection = (idx, p) => {
        setSelectedItems((prevItems) => {
            const updatedItems = { ...prevItems };
            if (!updatedItems[idx]) {
                updatedItems[idx] = {};
            }
            updatedItems[idx][p] = !updatedItems[idx][p]; // 토글
            return updatedItems;
        });
    };

    const runTool = (e) => {
        e.preventDefault();

        if (Object.keys(selectedItems).length === 0) {
            setshow(!show)
            return;
        }

        const selectedTool = tools.find((tool, idx) => selectedEventKey === `selected-${idx}`);
        console.log(selectedTool);

        const selectedNodes = {
            case_id: case_id,
            tool_id: selectedTool.tool_id,
            properties: labelData.map((node, nodeIdx) => {
                    if (selectedItems[node.node_id]) {
                        const property_list = Object.keys(node.property).reduce((acc, key) => {
                            if (selectedItems[node.node_id][key]) {
                                acc.push({ [key]: node.property[key] });
                            }
                            return acc;
                        }, []);
                        return {
                            node_id: node.node_id,
                            property: property_list,
                        };
                    }
                    return null; // 선택되지 않은 항목은 null 처리
                })
                .filter((node) => node !== null), // null이 아닌 항목만 유지
        };

        console.log(selectedNodes);

        Axios.post('/tools/runTools', selectedNodes)
            .then((response) => {
                console.log(response.data);
                props.newRun(true)
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
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                    setSelectedEventKey(`selected-${idx}`);
                                }}
                            >
                                <ChevronRight />
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    });

    const selectedNode = tools?.map((tool, idx) => {
        return selectedEventKey === `selected-${idx}` ? (
                <Card className="mt-1 tw-w-full">
                    <Card.Header className="mb-1">
                        <Button
                            variant="light"
                            size="sm"
                            className="tw-mr-2"
                            onClick={() => {
                                setSelectedEventKey('list');
                            }}
                        >
                            <ChevronLeft />
                        </Button>
                        {tool.name}
                    </Card.Header>
                    <Card.Body>
                        {labelData.length ? (
                            <Form onSubmit={runTool}>
                                {tool.apply.map((p, idx) => (
                                    <Form.Group key={idx}>
                                        <Form.Label>{p}</Form.Label>
                                        {labelData.map((node, idx) => {
                                            // console.log(labelData);
                                            if (p in node.property) {
                                                return (
                                                    <Form.Check
                                                        key={`${node.node_id}-${p}`}
                                                        type="checkbox"
                                                        label={node.property[p]}
                                                        // checked={selectedItems[node.node_id] && selectedItems[node.node_id][p]}
                                                        onChange={() => toggleItemSelection(node.node_id, p)}
                                                    />
                                                );
                                            } else return `require ${p}`;
                                        })}
                                    </Form.Group>
                                ))}
                                <Col md={{ span: 3, offset: 9 }}>
                                    <Button variant="outline-dark" ref={runButton} type="submit" >
                                        <Play />
                                    </Button>
                                    {Object.keys(selectedItems).length === 0?(<Overlay target={runButton.current} show={show} placement="right">
                                    {(props) => (
                                        <Tooltip id="overlay-example" {...props}>
                                        No items selected
                                        </Tooltip>
                                    )}
                                    </Overlay>):null}
                                </Col>
                                
                            </Form>
                        ) : "Unavailable"}
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

export default ToolCard;
