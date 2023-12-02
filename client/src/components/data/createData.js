import React, { useState } from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import lbs from '../../labels'
import Axios  from 'axios';
import { useParams } from 'react-router-dom';

const CreateData = (props) => {
    const {case_id} = useParams()
    const label = props.label
    const title = lbs[label].title
    const [listProperty, setlistProperty] = useState([""])
    // const [label, setlabel] = useState("")
    const properties = lbs[label].properties
    const initialFormData = {};
    properties.forEach(property => {
        initialFormData[property] = "";
    });
    const [formData, setformData] = useState({"case_id":case_id,[label]:{}})
    const updateFormValue = (key, value) => {
        setformData(prevState => {
            return {
                ...prevState,
                [label] : {
                    ...prevState[label],
                    [key]: value
                }
            };
        });
    }

    const submitData = async (e) => {

        e.preventDefault();
        console.log(formData);

        await Axios.post('/data/createData',formData)
        .then((res)=>{
            console.log(res);
            window.location.reload()
        })
        .catch((error)=>{
            console.log(error);
        })


    }


    const formList = properties.map((p)=>{
        if(lbs[label].list.includes(p.property)){
            return(
                <Form.Group className="mb-1" controlId={`${p.property}`}>
                    <Form.Label>{p.property+" "}
                    <Button
                        size='sm'   
                        variant="outline-success"
                        onClick={(e) => {
                        setlistProperty([...listProperty, '']);
                        }}
                        >
                        +
                    </Button>
                    </Form.Label>
                    
                    {listProperty.map((item, idx) => (
                    <div key={idx} className="d-flex mb-1">
                        <Form.Control
                        value={item}
                        onChange={(e) => {
                        const newProperty = [...listProperty];
                        newProperty[idx] = e.target.value;
                        setlistProperty(newProperty);
                        updateFormValue(p.property, newProperty);
                        }}
                        />
                        
                    </div>
                    ))}
                    
                </Form.Group>

            )
        }
        else if(p.as==="select"){
            return(
                <InputGroup className='mb-1'>
                    <InputGroup.Text id={`${p.property}`}>{p.name}</InputGroup.Text>
                    <Form.Select
                    onChange={(e)=>updateFormValue(p.property,e.target.value)}
                    >
                    {p.option.map((op)=>{
                        return(<option value={op}>{op}</option>)
                    })}
                    </Form.Select>
                </InputGroup>
            )
        }
        else if (p.as==="textarea"){
            return (<InputGroup className='mb-1'>
            <InputGroup.Text id={`${p.property}`}>{p.name}</InputGroup.Text>
            <Form.Control as="textarea"
            value={formData[label][p.property]||""}
            onChange={(e)=>{updateFormValue(p.property,e.target.value)}}
            required={title===p.property}
            />
            </InputGroup>)
        }else{ //input
            return (<InputGroup className='mb-1'>
            <InputGroup.Text id={`${p.property}`}>{p.name}</InputGroup.Text>
            <Form.Control as="input"
            type={p.inputType}
            value={formData[label][p.property]||""}
            onChange={(e)=>{
                let value = e.target.value
                if(p.inputType==="datetime-local") value = value.replace("T"," ");
                updateFormValue(p.property,value)
            }}
            required={title===p.property}
            />
            </InputGroup>)
        }

        // if(property.includes("date")||property.includes("Date")){
        //     return(<InputGroup className='mb-1'>
        //     <InputGroup.Text id={`${property}`}>{property}</InputGroup.Text>
        //     <Form.Control 
        //     value={formData[label][property]||""}
        //     onChange={(e)=>{const value = e.target.value.replace("T"," "); updateFormValue(property,value)}}
        //     required={title===property}
        //     type='datetime-local'
        //     />
        //     </InputGroup>)
        // }
        // if(lbs[label].list.includes(property)){
        //     return(
                // <Form.Group className="mb-1" controlId={`${property}`}>
                //     <Form.Label>{property+" "}
                //     <Button
                //         size='sm'   
                //         variant="outline-success"
                //         onClick={(e) => {
                //         setlistProperty([...listProperty, '']);
                //         }}
                //         >
                //         +
                //     </Button>
                //     </Form.Label>
                    
                //     {listProperty.map((item, idx) => (
                //     <div key={idx} className="d-flex mb-1">
                //         <Form.Control
                //         value={item}
                //         onChange={(e) => {
                //         const newProperty = [...listProperty];
                //         newProperty[idx] = e.target.value;
                //         setlistProperty(newProperty);
                //         updateFormValue(property, newProperty);
                //         }}
                //         />
                        
                //     </div>
                //     ))}
                    
                // </Form.Group>

                
        //     )
        // }
        // return(
        // <InputGroup className='mb-1'>
        //         <InputGroup.Text id={`${property}`}>{property}</InputGroup.Text>
        //         <Form.Control as={property==="note"||property==="content"?"textarea":"input"}
        //         value={formData[label][property]||""}
        //         onChange={(e)=>{updateFormValue(property,e.target.value)}}
        //         required={title===property}
        //         />
        // </InputGroup>
        // )
    })


    return (
            <Form className='m-1' onSubmit={submitData}>
            {formList}
            <Col md={{ span: 3, offset: 9 }}>
            <Button variant="disable" className='tw-bg-bright-peach hover:tw-bg-peach hover:tw-text-black tw-border-0 tw-text-peach' type="submit">
            Create
            </Button>
            </Col>
            </Form>
        

    )
}

export default CreateData