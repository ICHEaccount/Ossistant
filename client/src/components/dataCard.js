import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { ChevronRight, ChevronLeft, PlusCircle , PencilSquare, Check} from 'react-bootstrap-icons';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import labels from '../labels';
import CreateData from './createData';

const DataCard = (props) => {
    const label = props.label
    const nodes = props.nodes
    const title = labels[label].title

    const [selectedEventKey, setSelectedEventKey] = useState('list');
    const [onEdit, setonEdit] = useState(false)

    // useEffect(() => {
    //     if(nodes==null){
    //     setSelectedEventKey('create')
    //     }

    // }, [nodes])
    


    const nodeList = nodes?.map((node, idx) => (
        <Card
        className='mt-1'
        key={node.id}
        >
        <Card.Body>
            <Row>
                <Col xs="10">
                {node.property[title]}
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
    ));

    const selectedNode = nodes?.map((node,idx)=>
        selectedEventKey === `selected-${idx}` ? (
            <Card className='mt-1'>
            <Card.Header className='mb-1'>
                <Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setSelectedEventKey('list')}}><ChevronLeft/></Button>
                
                {node.property[title]}
                {onEdit?
                <Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setonEdit(false)}}><Check/></Button>
                :<Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setonEdit(true)}}><PencilSquare/></Button>}
            </Card.Header>
            <Form>
                {Object.keys(node.property).map(key => (
                <InputGroup className='mb-1'>
                <InputGroup.Text id={`${key}-${idx}`}>{key}</InputGroup.Text>
                <Form.Control
                placeholder={node.property[key]}
                disabled={!onEdit}
                />
                </InputGroup>

                ))}
            </Form>
            </Card>): null
    )

    return (
        <Container>
            {selectedEventKey!=="list" ? selectedNode : nodeList}
            {selectedEventKey==="create"?<CreateData label ={label}/>:
            <Card className='align-items-center mt-1 cursor-pointer' onClick={() => { setSelectedEventKey('create') }}>
            <Button variant="light" size='sm' className='tw-mr-2'><PlusCircle /></Button>
            </Card>
            }

        </Container>
    
    );
}

export default DataCard