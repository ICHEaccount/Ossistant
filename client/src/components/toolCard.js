import React, { useState } from 'react'
import { Button, Card, Container, Form, InputGroup } from 'react-bootstrap'
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import lbs from '../labels'
import { ChevronLeft, ChevronRight, Play} from 'react-bootstrap-icons';

const ToolCard = (props) => {
    const label = props.label
    const tools = props.labelTools //해당 label에 적용 가능한 툴들
    const labelData = props.labelData //해당 label에 해당되는 데이터
    const [selectedEventKey, setSelectedEventKey] = useState('list');

    const runTool=()=>{

    }

    const toolList = tools?.map((tool,idx)=>{
        return(
            <Card className='mt-1'key={tool.name}>
            <Card.Body>
            <Row>
                <Col xs="10">
                {tool.name}
                </Col>
                <Col xs="2" className="d-flex align-items-center" >
                    <Button variant="outline-primary" size="sm"
                    onClick={() => {
                        setSelectedEventKey(`selected-${idx}`);
                    }}>
                        <ChevronRight/>
                    </Button>
                </Col>
            </Row>
            
        
        </Card.Body>

            </Card>
        )
        
    })

    const selectedNode = tools?.map((tool,idx)=>{
        return(selectedEventKey === `selected-${idx}` ? (
            <Container>
            <Card className='mt-1'>
                <Card.Header className='mb-1'>
                    <Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setSelectedEventKey('list')}}><ChevronLeft/></Button>
                    {tool.name}
                </Card.Header>
                <Card.Body>
                    {labelData?
                        <Form onSubmit={runTool}>

                            {tool.apply.map((p,idx) => {
                                    return (
                                    <Form.Group>
                                        <Form.Label>{p}</Form.Label>
                                        {labelData.map((node,idx)=>{
                                        if(p in node.property){
                                            return(
                                                <Form.Check type="checkbox" label={node.property[p]}/>
                                                

                                            )}
                                        else return `require ${p}`
                                        })}
                                    </Form.Group>)
                                    })

                            }

                            <Col md={{ span: 3, offset: 9 }}>
                            <Button variant="outline-dark" type="submit">
                            <Play/>
                            </Button>
                            </Col>
                        </Form>
                        
                    :"Unavailable"}
                </Card.Body>
            </Card>
            </Container>
        ): null)}
    )



    return (
        <Container>
        {selectedEventKey==="list"?(toolList):selectedNode}
        </Container>
    
    )
}

export default ToolCard