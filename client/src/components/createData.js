import React, { useState } from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import labels from '../labels'
import { Axios } from 'axios';

const CreateData = (props) => {
    // const [label, setlabel] = useState("")
    const label = props.label
    const properties = labels[label].properties
    const initialFormData = {};
    properties.forEach(property => {
        initialFormData[property] = "";
    });
    initialFormData["note"] = "";
    const [formData, setformData] = useState({})
    const updateFormValue = (key, value) => {
        setformData(prevData => ({
            ...prevData,
            [key]: value
        }));
    }

    const submitData = async (e) => {

        e.preventDefault();

        try {
            const res= await Axios.post('/data/createData',formData)
            console.log('res',res);
        } catch (error) {
            console.error(error);
        }

        console.log(formData);
        window.location.reload();
    }


    const formList = properties.map((property)=>(
        <InputGroup className='mb-1'>
                <InputGroup.Text id={`${property}`}>{property}</InputGroup.Text>
                <Form.Control
                onChange={(e)=>{updateFormValue(property,e.target.value)}}
                />
                </InputGroup>
    ))
    return (
            <Form className='m-1' onSubmit={submitData}>
            {formList}
            <InputGroup className='mb-2'>
                <InputGroup.Text id='note'>note</InputGroup.Text>
                <Form.Control
                onChange={(e) => {updateFormValue("note",e.target.value);}}
                as="textarea" />
            </InputGroup>
            <Col md={{ span: 3, offset: 9 }}>
            <Button variant="outline-primary" type="submit">
            Create
            </Button>
            </Col>
            </Form>
        

    )
}

export default CreateData