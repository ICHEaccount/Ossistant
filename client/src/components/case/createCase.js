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
import { Card } from 'react-bootstrap';


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
    <Card className='mt-3 tw-border-navy'>
        <Card.Header className='tw-bg-navy tw-border-0 tw-text-white'>Create New Case</Card.Header>
        <Card.Body>
        <Form  onSubmit={submitCase}>
            <InputGroup className={cls("mb-1",{"tw-border-red-500":errors.caseName})}>
                <InputGroup.Text id="basic-addon1" className='tw-bg-navy tw-border-navy tw-fill-'><Fingerprint className='tw-fill-white'/></InputGroup.Text>
                <Form.Control
                value={caseName}
                onChange={(e) => {setCaseName(e.target.value);}}
                placeholder="Case name"
                aria-label="Case name"
                aria-describedby="basic-addon1"
                required
                className='tw-border-navy'
                />
            </InputGroup>

            <InputGroup className={cls("mb-1",{"tw-border-red-500":errors.caseName})}>
                <InputGroup.Text id="basic-addon2" className='tw-bg-navy tw-border-navy'><Icon123 className='tw-fill-white'/></InputGroup.Text>
                <Form.Control
                value={caseNumber}
                onChange={(e) => {setCaseNumber(e.target.value);}}
                placeholder="Case number"
                aria-label="Case number"
                aria-describedby="basic-addon2"
                className='tw-border-navy'
                />
            </InputGroup>

            <InputGroup className={cls("mb-1",{"tw-border-red-500":errors.caseName})}>
                <InputGroup.Text id="basic-addon3" className='tw-bg-navy tw-border-navy'><PersonVcard className='tw-fill-white'/></InputGroup.Text>
                <Form.Control
                value={investigator}
                onChange={(e) => {setInvestigator(e.target.value);}}
                placeholder="Investigator"
                aria-label="Investigator"
                aria-describedby="basic-addon3"
                className='tw-border-navy'
                />
            </InputGroup>

            <InputGroup className={cls("mb-1",{"tw-border-red-500":errors.caseName})}>
                <InputGroup.Text className='tw-bg-navy tw-border-navy'><FileText className='tw-fill-white'/></InputGroup.Text>
                <Form.Control
                value={description}
                onChange={(e) => {setDescription(e.target.value);}}
                as="textarea" 
                aria-label="Description" 
                placeholder='Description' 
                className='tw-border-navy'
                />
            </InputGroup>

            <div className='tw-flex tw-justify-end'>
            <Button variant="disable" className='tw-bg-navy hover:tw-bg-dark-navy tw-border-0 tw-text-white hover:tw-text-white' type="submit">
            Create
            </Button>
            </div>
            
        </Form>
        
        </Card.Body>
    
    </Card>
    )
}

export default CreateCase