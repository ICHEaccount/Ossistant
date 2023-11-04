import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { ChevronRight, ChevronLeft, PlusCircle , PencilSquare, Check, Trash} from 'react-bootstrap-icons';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import lbs from '../../labels';
import CreateData from './createData';
import cls from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import {select,clear,viewChange} from '../../reducers/node'
import  Axios  from 'axios';

const DataCard = (props) => {
    const selected = useSelector(state => state.node.selected)
    const view = useSelector(state => state.node.view)
    const dispatch = useDispatch()
    const label = props.label
    const newData = props.newData
    const title = lbs[label].title
    const [onEdit, setonEdit] = useState(false)
    const [nodes, setnodes] = useState(props.nodes)
    const [formData, setformData] = useState(selected?selected.property:{})

    const editData = (e)=>{
        e.preventDefault();
        const postData={
            "data_id":selected.node_id,
            [label]:formData
        }
        console.log(postData);
        Axios.post(`/data/editData`,postData)
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        })
        dispatch(select({node:{...selected,
            "property":formData
        },label:label}))
    }

    const onChange = (key,value) =>{
        console.log(formData);
        setformData({
            ...selected.property,
            [key]:value
        })
    }

    const onDelete = () =>{
        // console.log(selected);
        Axios.get(`/data/deleteData/${selected.node_id}`)
        .then((res)=>{
            console.log(res);
            setnodes(nodes.filter((n)=>{return n.node_id!==selected.node_id}))
            dispatch(clear());
            console.log(nodes);
        })
        .catch((err)=>{
            console.log(err);
        })
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
                        <Form onSubmit={editData}>
                        <Card.Header className='mb-1'>
                            <Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{dispatch(viewChange('list'));dispatch(clear())}}><ChevronLeft/></Button>
                            {selected.property[title]}
                            {onEdit?
                            <Button variant="light"  size='sm' className='tw-mr-2' onClick={()=>{setonEdit(false)}}><Check/></Button>
                            :<Button variant="light" type='submit' size='sm' className='tw-mr-2' onClick={()=>{setonEdit(true)}}><PencilSquare/></Button>}
                            <Button variant="light" size='sm' className='tw-mr-2' onClick={onDelete}><Trash/></Button>
                        </Card.Header>
                        
                            {lbs[label].properties.map((key) => {
                                if(key==="note"){
                                    return (<InputGroup className='mb-1 px-1'>
                                    <InputGroup.Text id='note'>note</InputGroup.Text>
                                    <Form.Control
                                    value={formData.note}
                                    disabled={!onEdit}
                                    onChange={(e)=>onChange(key,e.target.value)}
                                    as="textarea" />
                                    </InputGroup>)
                                }
                                return(
                                    <InputGroup className='mb-1 px-1'>
                                    <InputGroup.Text >{key}</InputGroup.Text>
                                    <Form.Control
                                    value={formData[key]}
                                    onChange={(e)=>onChange(key,e.target.value)}
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