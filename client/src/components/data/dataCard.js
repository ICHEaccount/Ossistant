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
import {select,clear,viewChange, changeBehavior} from '../../reducers/node'
import  Axios  from 'axios';
import { ListGroup } from 'react-bootstrap';

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
    const [listProperty, setlistProperty] = useState(formData?(formData[lbs[label].list]?formData[lbs[label].list]:[]):[])

    const editData = (e)=>{
        e.preventDefault()
        const postData={
            "data_id":selected.node_id,
            [label]:formData
        }
        Axios.post(`/data/editData`,postData)
        .then((res)=>{
            console.log(res);
            dispatch(select({node:{...selected,
                "property":formData
            },label:label}))
            setonEdit(false);
            dispatch(changeBehavior('modify-data'))
        })
        .catch((err)=>{
            console.log(err);
        })

    }

    const onChange = (key,value) =>{
        // console.log(formData);
        setformData({
            ...formData,
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
            dispatch(changeBehavior('delete-data'))
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
        className={cls('mt-1',{"tw-bg-bright-peach":newData&&newData.some((newNode)=>newNode.node_id===node.node_id)})}
        // key={node.id}
        >
        <Card.Body>
            <Row>
                <Col xs="10">
                {node.property[title]?node.property[title]:"untitled"}
                </Col>
                
                <Col xs="2" className="d-flex align-items-center" >
                    <ChevronRight className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-white' size={20} onClick={()=>dispatch(select({node,label}))}/>
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
                        <Card.Header className='mb-1 tw-bg-bright-peach'>
                        <ChevronLeft className='tw-mr-2 hover:tw-cursor-pointer tw-inline tw-rounded-md' size={20} onClick={()=>{dispatch(viewChange('list'));dispatch(clear())}}/>
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
                        <Card.Header className='mb-1 tw-bg-bright-peach'>
                            <Row>
                            <Col xs="9">
                            <ChevronLeft className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-bright-peach' size={20} onClick={()=>{dispatch(viewChange('list'));dispatch(clear())}}/>
                            {selected.property[title]?selected.property[title]:"untitled"}
                            </Col>
                            <Col xs="1">
                            {onEdit?
                            <Check onClick={editData} type='submit' className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-bright-peach tw-rounded-md' size={20}/>
                            :<PencilSquare className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-bright-peach tw-rounded-md' size={20} onClick={(e)=>{e.preventDefault(); setonEdit(true)}}/>
                            }
                            </Col>
                            <Col xs="1">   
                            <Trash className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-bright-peach tw-rounded-md' size={20}  onClick={onDelete}/>
                            </Col>
                            </Row>
                            
                        </Card.Header>
                        
                            {lbs[label].properties.map((key) => {
                                if(key==="note"){
                                    return (<InputGroup className='mb-1 px-1' >
                                    <InputGroup.Text id='note'>note</InputGroup.Text>
                                    <Form.Control
                                    value={formData.note}
                                    disabled={!onEdit}
                                    onChange={(e)=>onChange(key,e.target.value)}
                                    as="textarea" />
                                    </InputGroup>)
                                }
                                if(lbs[label].list.includes(key)){
                                    // setlistProperty(formData[key])
                                    return(<Form.Group className="mb-1 px-1">
                                    <Form.Label className='ml-1'>{key+" "}
                                    <Button
                                        size='sm'
                                        // disabled={!onEdit}
                                        variant="outline-success"
                                        onClick={(e) => {
                                        setlistProperty([...listProperty, '']);
                                        setonEdit(true)
                                        }}
                                        >
                                        +
                                    </Button>
                                    </Form.Label>
                                    <div className={cls("",{"tw-max-h-32 tw-overflow-y-auto":listProperty})}>
                                    {listProperty?.map((item, idx) => (
                                    <div key={idx} className="d-flex mb-1">
                                        <Form.Control
                                        className='tw-rounded-r-none'
                                        value={item}
                                        disabled={!onEdit}
                                        onChange={(e) => {
                                        const newProperty = [...listProperty];
                                        newProperty[idx] = e.target.value;
                                        setlistProperty(newProperty);
                                        onChange(key, newProperty);
                                        }}
                                        />
                                        <Button
                                            className='tw-rounded-l-none'
                                            variant="outline-danger"
                                            // disabled={!onEdit}
                                            onClick={(e) => {
                                            const newProperty = listProperty.filter((_, index) => index !== idx);
                                            setlistProperty(newProperty);
                                            onChange(key, newProperty);
                                            setonEdit(true)
                                            }}
                                        >
                                            -
                                        </Button>
                                    </div>
                                    ))}
                                    </div>
                                    
                                    
                                </Form.Group>)
                                    
                                }
                                return(
                                    <InputGroup className='mb-1 px-1'>
                                    <InputGroup.Text >{key}</InputGroup.Text>
                                    <Form.Control
                                    value={formData[key]|| ""}
                                    onChange={(e)=>onChange(key,e.target.value)}
                                    disabled={!onEdit}
                                    required={title===key}
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