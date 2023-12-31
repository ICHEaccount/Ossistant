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
                    <ChevronRight className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-transparent' size={20} onClick={()=>dispatch(select({node,label}))}/>
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
                            <button type='submit' className='tw-bg-transparent'>
                            <Check  className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-bright-peach tw-rounded-md' size={20}/>
                            </button>
                            :<PencilSquare className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-bright-peach tw-rounded-md' size={20} onClick={(e)=>{e.preventDefault(); setonEdit(true)}}/>
                            }
                            </Col>
                            <Col xs="1">   
                            <Trash className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-bright-peach tw-rounded-md' size={20}  onClick={onDelete}/>
                            </Col>
                            </Row>
                            
                        </Card.Header>
                        
                            {lbs[label].properties.map((p) => {
                                if(p.property==="others"){
                                    if(!formData.others) return null
                                    // console.log(formData.others);
                                    return(
                                        Object.keys(formData.others).map((type,idx)=>{
                                            if(formData.others[type].length>1){
                                                return(
                                                    <Form.Group className="mb-1 px-1" controlId={`${type}`}>
                                                    <Form.Label className='ml-1'>{type+" "} </Form.Label>
                                                    <div className="tw-max-h-32 tw-overflow-y-auto">
                                                    {formData.others[type]?.map((value, idx) => (
                                                    <div key={idx} className="d-flex mb-1">
                                                        <Form.Control
                                                        className='tw-rounded-r-none tw-overflow-x-auto'
                                                        value={value}
                                                        readOnly={true}
                                                        // disabled={true}
                                                        />
                                                    </div>
                                                    ))}
                                                    </div>
                                                </Form.Group>
                                                )
                                            }else{
                                                return(
                                                <InputGroup className='mb-1 px-1'>
                                                <InputGroup.Text id={`${type}`}>{type}</InputGroup.Text>
                                                <Form.Control 
                                                value={formData.others[type][0]}
                                                className='tw-overflow-x-auto'
                                                readOnly={true}
                                                // disabled={true}
                                                />
                                                </InputGroup>
                                                )
                                            }
                                        }
                                    ))
                                }
                                else if(lbs[label].list.includes(p.property)){
                                    return(
                                        <Form.Group className="mb-1 px-1" controlId={`${p.property}`}>
                                            <Form.Label className='ml-1'>{p.name+" "}
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
                                                className='tw-rounded-r-none tw-overflow-x-auto'
                                                value={item}
                                                disabled={!onEdit}
                                                onChange={(e) => {
                                                const newProperty = [...listProperty];
                                                newProperty[idx] = e.target.value;
                                                setlistProperty(newProperty);
                                                onChange(p.property, newProperty);
                                                }}
                                                />
                                                <Button
                                                    className='tw-rounded-l-none'
                                                    variant="outline-danger"
                                                    // disabled={!onEdit}
                                                    onClick={(e) => {
                                                    const newProperty = listProperty.filter((_, index) => index !== idx);
                                                    setlistProperty(newProperty);
                                                    onChange(p.property, newProperty);
                                                    setonEdit(true)
                                                    }}
                                                >
                                                    -
                                                </Button>
                                            </div>
                                            ))}
                                            </div>
                                                
                                                
                                        </Form.Group>
                        
                                    )
                                }
                                else if(p.as==="select"){
                                    return(
                                        <InputGroup className='mb-1 px-1'>
                                        <InputGroup.Text id={`${p.property}`}>{p.name}</InputGroup.Text>
                                            <Form.Select
                                            onChange={(e)=>onChange(p.property,e.target.value)}
                                            value={formData[p.property]}
                                            disabled={!onEdit}
                                            >
                                            {p.option.map((op)=>{
                                                return(<option value={op}>{op}</option>)
                                            })}
                                            </Form.Select>
                                        </InputGroup>
                                    )
                                }
                                else if (p.as==="textarea"){
                                    return (<InputGroup className='mb-1 px-1'>
                                    <InputGroup.Text id={`${p.property}`}>{p.name}</InputGroup.Text>
                                    <Form.Control as="textarea"
                                    value={formData[p.property]}
                                    onChange={(e)=>{onChange(p.property,e.target.value)}}
                                    required={title===p.property}
                                    disabled={!onEdit}
                                    />
                                    </InputGroup>)
                                }else{ //input
                                    return (<InputGroup className='mb-1 px-1'>
                                    <InputGroup.Text id={`${p.property}`}>{p.name}</InputGroup.Text>
                                    <Form.Control 
                                    as="input"
                                    type={p.inputType}
                                    value={formData[p.property]}
                                    onChange={(e)=>{
                                        let value = e.target.value
                                        if(p.inputType==="datetime-local") value = value.replace("T"," ");
                                        onChange(p.property,value)
                                    }}
                                    required={title===p.property}
                                    disabled={!onEdit}
                                    className='tw-overflow-x-auto'
                                    />
                                    </InputGroup>)
                                }

                                // if(lbs[label].list.includes(key)){
                                //     // setlistProperty(formData[key])
                                //     return(<Form.Group className="mb-1 px-1">
                                //     <Form.Label className='ml-1'>{key+" "}
                                //     <Button
                                //         size='sm'
                                //         // disabled={!onEdit}
                                //         variant="outline-success"
                                //         onClick={(e) => {
                                //         setlistProperty([...listProperty, '']);
                                //         setonEdit(true)
                                //         }}
                                //         >
                                //         +
                                //     </Button>
                                //     </Form.Label>
                                //     <div className={cls("",{"tw-max-h-32 tw-overflow-y-auto":listProperty})}>
                                //     {listProperty?.map((item, idx) => (
                                //     <div key={idx} className="d-flex mb-1">
                                //         <Form.Control
                                //         className='tw-rounded-r-none'
                                //         value={item}
                                //         disabled={!onEdit}
                                //         onChange={(e) => {
                                //         const newProperty = [...listProperty];
                                //         newProperty[idx] = e.target.value;
                                //         setlistProperty(newProperty);
                                //         onChange(key, newProperty);
                                //         }}
                                //         />
                                //         <Button
                                //             className='tw-rounded-l-none'
                                //             variant="outline-danger"
                                //             // disabled={!onEdit}
                                //             onClick={(e) => {
                                //             const newProperty = listProperty.filter((_, index) => index !== idx);
                                //             setlistProperty(newProperty);
                                //             onChange(key, newProperty);
                                //             setonEdit(true)
                                //             }}
                                //         >
                                //             -
                                //         </Button>
                                //     </div>
                                //     ))}
                                //     </div>
                                    
                                    
                                // </Form.Group>)
                                    
                                // }
                                // return(
                                //     <InputGroup className='mb-1 px-1'>
                                //     <InputGroup.Text >{key}</InputGroup.Text>
                                //     <Form.Control
                                //     value={formData[key]|| ""}
                                //     onChange={(e)=>onChange(key,e.target.value)}
                                //     disabled={!onEdit}
                                //     required={title===key}
                                //     />
                                //     </InputGroup>
                                // )                         
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