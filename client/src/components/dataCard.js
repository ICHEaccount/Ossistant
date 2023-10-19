import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { ChevronRight, ChevronLeft, PlusCircle , PencilSquare, Check} from 'react-bootstrap-icons';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import lbs from '../labels';
import CreateData from './createData';
import cls from 'classnames'

const DataCard = (props) => {
    const label = props.label
    const nodes = props.nodes
    const newData = props.newData
    const title = lbs[label].title
    const [selectedEventKey, setSelectedEventKey] = useState('list');
    const [onEdit, setonEdit] = useState(false)

    const editData = ()=>{
        
    }


    const nodeList = nodes?.map((node, idx) => {
        // console.log(newData.some((newNode)=>newNode.node_id===node.node_id));
        console.log(newData);
        return(
        <Card
        className={cls('mt-1',{"tw-bg-blue-200":newData&&newData.some((newNode)=>newNode.node_id===node.node_id)})}
        // key={node.id}
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
    )});

    const selectedNode = nodes?.map((node,idx)=>
        selectedEventKey === `selected-${idx}` ? (
            <Container>
            <Card className='mt-1'>
                <Card.Header className='mb-1'>
                    <Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setSelectedEventKey('list')}}><ChevronLeft/></Button>

                    {node.property[title]}
                    {onEdit?
                    <Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setonEdit(false)}}><Check/></Button>
                    :<Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setonEdit(true)}}><PencilSquare/></Button>}
                </Card.Header>
                <Form onSubmit={editData}>
                    {lbs[label].properties.map((key) => {
                        if(key==="note"){
                            return (<InputGroup className='mb-1 px-1'>
                            <InputGroup.Text id='note'>note</InputGroup.Text>
                            <Form.Control
                            disabled={!onEdit}
                            placeholder={node.property.note}
                            as="textarea" />
                            </InputGroup>)
                        }
                        return(
                            <InputGroup className='mb-1 px-1'>
                            <InputGroup.Text id={`${key}-${idx}`}>{key}</InputGroup.Text>
                            <Form.Control
                            placeholder={node.property[key]}
                            disabled={!onEdit}
                            />
                            </InputGroup>
                        )
                        
                    }
                    )}
                    
                </Form>
            </Card>
            </Container>
        ): null
    )

    const switcher = () =>{
        switch (selectedEventKey) {
            case "list":
                return (
                    <Container>
                        {nodes?nodeList:null}
                        <Card className='align-items-center mt-1' onClick={() => { setSelectedEventKey('create') }}>
                        <Button variant="light" size='sm' className='tw-w-full d-flex justify-content-center align-items-center'><PlusCircle /></Button>
                        </Card>
                    </Container>
                )
            case "create":
                return(
                    <Container>
                        <Card className='mt-1'>
                        <Card.Header className='mb-1'>
                            <Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setSelectedEventKey('list')}}><ChevronLeft/></Button>
                            {`New ${label}`}
                        </Card.Header>
                            <CreateData label ={label}/>
                        </Card>
                    </Container>
                )
            default:
                return selectedNode
        }
    }

    return (
        switcher()
    );
}

export default DataCard