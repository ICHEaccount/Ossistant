import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { ChevronRight, ChevronLeft, PlusCircle , PencilSquare, Check} from 'react-bootstrap-icons';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import lbs from '../../labels';
import CreateData from './createData';
import cls from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import {select,clear,viewChange} from '../../reducers/node'

const DataCard = (props) => {
    const selected = useSelector(state => state.node.selected)
    const view = useSelector(state => state.node.view)
    const dispatch = useDispatch()
    const label = props.label
    const nodes = props.nodes
    const newData = props.newData
    const title = lbs[label].title
    const [onEdit, setonEdit] = useState(false)

    const editData = ()=>{
        
    }


    const nodeList = nodes?.map((node, idx) => {
        // console.log(newData.some((newNode)=>newNode.node_id===node.node_id));
        // console.log(newData);
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
                        dispatch(select({node,label}))
                    }}>
                        <ChevronRight/>
                    </Button>
                </Col>
            </Row>
            
        
        </Card.Body>
        </Card>
    )});

    const switcher = () =>{
        switch (view) {
            case "list":
                return (
                    <Container>
                        {nodes?nodeList:null}
                        <Card className='align-items-center mt-1' onClick={() => { dispatch(viewChange('create')) }}>
                        <Button variant="light" size='sm' className='tw-w-full d-flex justify-content-center align-items-center'><PlusCircle /></Button>
                        </Card>
                    </Container>
                )
            case "create":
                return(
                    <Container>
                        <Card className='mt-1'>
                        <Card.Header className='mb-1'>
                            <Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{dispatch(viewChange('list'))}}><ChevronLeft/></Button>
                            {`New ${label}`}
                        </Card.Header>
                            <CreateData label ={label}/>
                        </Card>
                    </Container>
                )
            default:
                return (
                    <Container>
                    <Card className='mt-1'>
                        <Card.Header className='mb-1'>
                            <Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{dispatch(viewChange('list'))}}><ChevronLeft/></Button>
                            {selected.property[title]}
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
                                    placeholder={selected.property.note}
                                    as="textarea" />
                                    </InputGroup>)
                                }
                                return(
                                    <InputGroup className='mb-1 px-1'>
                                    <InputGroup.Text >{key}</InputGroup.Text>
                                    <Form.Control
                                    placeholder={selected.property[key]}
                                    disabled={!onEdit}
                                    />
                                    </InputGroup>
                                )                         
                            }
                            )}                     
                        </Form>
                    </Card>
                    </Container>
                )
        }
    }

    return (
        switcher()
    );
}

export default DataCard