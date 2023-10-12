import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { ChevronLeft, ChevronRight, Play } from 'react-bootstrap-icons';
import Axios from 'axios';

const ToolCard = (props) => {
    const tools = props.labelTools;
    const labelData = props.labelData;
    const [selectedEventKey, setSelectedEventKey] = useState('list');
    const [selectedItems, setSelectedItems] = useState({});

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

        const selectedTool = tools.find((tool, idx) => selectedEventKey === `selected-${idx}`);

        const selectedNodes = {
            tool_id: selectedTool.id,
            properties: labelData
                .map((node, nodeIdx) => {
                    if (selectedItems[node.id]) {
                        return {
                            node_id: node.id,
                            property: Object.keys(node.property).filter((p) => selectedItems[node.id][p]),
                        };
                    }
                    return null; // 선택되지 않은 항목은 null 처리
                })
                .filter((node) => node !== null), // null이 아닌 항목만 유지
        };

        console.log(selectedNodes);

        // Axios.post('/tools/runTools', selectedNodes)
        //     .then((response) => {
        //         console.log(response.data);
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
    };

    const toolList = tools?.map((tool, idx) => {
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
            <Container>
                <Card className="mt-1">
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
                        {labelData ? (
                            <Form onSubmit={runTool}>
                                {tool.apply.map((p, idx) => (
                                    <Form.Group key={idx}>
                                        <Form.Label>{p}</Form.Label>
                                        {labelData.map((node, idx) => {
                                            if (p in node.property) {
                                                return (
                                                    <Form.Check
                                                        key={`${node.id}-${p}`}
                                                        type="checkbox"
                                                        label={node.property[p]}
                                                        checked={selectedItems[node.id] && selectedItems[node.id][p]}
                                                        onChange={() => toggleItemSelection(node.id, p)}
                                                    />
                                                );
                                            } else return `require ${p}`;
                                        })}
                                    </Form.Group>
                                ))}
                                <Col md={{ span: 3, offset: 9 }}>
                                    <Button variant="outline-dark" type="submit">
                                        <Play />
                                    </Button>
                                </Col>
                            </Form>
                        ) : "Unavailable"}
                    </Card.Body>
                </Card>
            </Container>
        ) : null;
    });

    return (
        <Container>
            {selectedEventKey === 'list' ? toolList : selectedNode}
        </Container>
    );
};

export default ToolCard;
