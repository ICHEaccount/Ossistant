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
    const [listProperty, setlistProperty] = useState([" "])
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
            // window.location.reload()
        })
        .catch((error)=>{
            console.log(error);
        })


    }


    const formList = properties.map((property)=>{
        if(lbs[label].list.includes(property)){
            return(
                <Form.Group className="mb-3" controlId={`${property}`}>
                    <Form.Label>{property+" "}
                    <Button
                        variant="secondary"
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
                        updateFormValue(property, listProperty);
                        }}
                        />
                        
                    </div>
                    ))}
                    
                </Form.Group>

                
            )
        }
        return(
        <InputGroup className='mb-1'>
                <InputGroup.Text id={`${property}`}>{property}</InputGroup.Text>
                <Form.Control as={property==="note"?"textarea":"input"}
                value={formData[label][property]||""}
                onChange={(e)=>{updateFormValue(property,e.target.value)}}
                required={title===property}
                />
        </InputGroup>
    )})


    return (
            <Form className='m-1' onSubmit={submitData}>
            {formList}
            <Col md={{ span: 3, offset: 9 }}>
            <Button variant="outline-primary" type="submit">
            Create
            </Button>
            </Col>
            </Form>
        

    )
}

export default CreateData