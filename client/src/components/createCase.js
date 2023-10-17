import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Axios from "axios";
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/esm/Button';
import { Fingerprint,PersonVcard,FileText,Icon123 } from 'react-bootstrap-icons';
import Col from 'react-bootstrap/esm/Col';
import cls from 'classnames'


const CreateCase = () => {
    const navigate = useNavigate();

    const [caseName, setCaseName] = useState("")
    const [caseNumber, setCaseNumber] = useState("")
    const [investigator, setInvestigator] = useState("")
    const [description, setDescription] = useState("")
    const [errors, seterrors] = useState({})


    const submitCase = async (e) => {
        const formContent ={
            "case_name":caseName,
            "case_number":caseNumber,
            "investigator":investigator,
            "description":description
        }

        e.preventDefault();

    
        await Axios.post('/case/createCase',formContent)
        .then((res)=>{
            console.log('res',res);
            navigate(`/casepage/${res.data.case_id}`)
        })
        .catch((error)=>{
            console.error(error);
            seterrors(error.response.data||{});
        })
    }
    


    return (
    <Accordion defaultActiveKey="0" className='mt-2'>
        <Accordion.Item eventKey="0">
        <Accordion.Header>Create New Case</Accordion.Header>
        <Accordion.Body>
        <Form  onSubmit={submitCase}>
            <InputGroup className={cls("mb-3",{"tw-border-red-500":errors.caseName})}>
                <InputGroup.Text id="basic-addon1"><Fingerprint/></InputGroup.Text>
                <Form.Control
                value={caseName}
                onChange={(e) => {setCaseName(e.target.value);}}
                placeholder="Case name"
                aria-label="Case name"
                aria-describedby="basic-addon1"
                
                />
            </InputGroup>

            <InputGroup className={cls("mb-3",{"tw-border-red-500":errors.caseName})}>
                <InputGroup.Text id="basic-addon2"><Icon123/></InputGroup.Text>
                <Form.Control
                value={caseNumber}
                onChange={(e) => {setCaseNumber(e.target.value);}}
                placeholder="Case number"
                aria-label="Case number"
                aria-describedby="basic-addon2"
                />
            </InputGroup>

            <InputGroup className={cls("mb-3",{"tw-border-red-500":errors.caseName})}>
                <InputGroup.Text id="basic-addon3"><PersonVcard/></InputGroup.Text>
                <Form.Control
                value={investigator}
                onChange={(e) => {setInvestigator(e.target.value);}}
                placeholder="Investigator"
                aria-label="Investigator"
                aria-describedby="basic-addon3"
                />
            </InputGroup>

            <InputGroup className={cls("mb-3",{"tw-border-red-500":errors.caseName})}>
                <InputGroup.Text><FileText/></InputGroup.Text>
                <Form.Control
                value={description}
                onChange={(e) => {setDescription(e.target.value);}}
                as="textarea" 
                aria-label="Description" 
                placeholder='Description' />
            </InputGroup>

            <Col md={{ span: 3, offset: 10 }}>
            <Button variant="outline-primary" type="submit">
            Create
            </Button>
            </Col>
            
        </Form>
        
        </Accordion.Body>
        </Accordion.Item>
    
    </Accordion>
    )
}

export default CreateCase