import { useState } from 'react';
import { ArrowRightSquare, Calendar, PersonVcard, Trash, PencilSquare ,Check, Fingerprint, Icon123, FileText} from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Stack from 'react-bootstrap/esm/Stack';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import cls from 'classnames'
import Axios from "axios";



function CaseCard(props) {
    const data = props.caseData
    const navigate = useNavigate();
    const [onEdit, setonEdit] = useState(false)
    const [caseName, setCaseName] = useState(data.case_name)
    const [caseNumber, setCaseNumber] = useState(data.case_num)
    const [investigator, setInvestigator] = useState(data.investigator)
    const [description, setDescription] = useState(data.description)
    const [errors, seterrors] = useState({})


    const onMove = () =>{
        navigate(`/casepage/${data.case_id}`)
    }

    const onUpdate = (e) =>{
        const formContent ={
            "case_id":data.case_id,
            "case_name":caseName,
            "case_number":caseNumber,
            "investigator":investigator,
            "description":description
        }
        
        e.preventDefault()

        Axios.post("/case/editCase",formContent)
        .then((res)=>{
            console.log('res',res);
            setonEdit(!onEdit)

        })
        .catch((error)=>{
            console.error(error);
            seterrors(error.response.data||{});
        })

    }


    return (
        <div>
            {onEdit?
            (<Card className='tw-shadow-sm'>
                <Form  onSubmit={onUpdate} className='tw-pr-2'>
                    <Row>
                        <Col sm={11}>
                            <Form.Control required className="m-1 pr-2" size="sm"  value={caseName} defaultValue={data.case_name} onChange={(e)=> {setCaseName(e.target.value);}} placeholder='case name' />
                        </Col>
                        <Col  className="d-flex align-items-center" sm={1}>
                        <Check className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-white' size={20} onClick={onUpdate}/>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col className="m-1">
                        <Form.Control size="sm"  value={caseNumber} defaultValue={data.case_num} onChange={(e)=> {setCaseNumber(e.target.value);}} placeholder='case number' />
                        </Col>
                        <Col className="m-1">
                        <Form.Control size="sm" type="text" value={investigator} defaultValue={data.investigator} onChange={(e)=> {setInvestigator(e.target.value);}} placeholder='investigator' />
                            
                        </Col>
                        <Col className="d-flex align-items-center">
                            <Calendar className='m-1'/>
                            {data.created_date.split(':')[0]}
                        </Col>
                    </Row>
                    
                    <Form.Control as="textarea"size="sm" className='m-1'  value={description} defaultValue={data.description} onChange={(e)=> {setDescription(e.target.value);}} placeholder='description' />
                    
                </Form>
                </Card>
            ):(
            <Card className='tw-shadow-sm'>
                <Row className='m-2'>
                <Col md="11">
                <Card.Link href={`/casepage/${data.case_id}`}>
                <Card.Title>{caseName}</Card.Title>
                        <Card.Subtitle className='text-muted'>
                            <Row>
                                <Col>
                                    {caseNumber}
                                </Col>
                                <Col className="d-flex align-items-center">
                                    <PersonVcard className='m-1'/>
                                    {investigator}
                                </Col>
                                <Col className="d-flex align-items-center">
                                    <Calendar className='m-1'/>
                                    {data.created_date.split(':')[0]}
                                </Col>
                            </Row>
                        </Card.Subtitle>
                            <Card.Text className='tw-flex'>
                                {description}
                            </Card.Text>
                </Card.Link>

                </Col>

                <Col md="1" className="d-flex align-items-center">
                    <Stack className='flex-column justify-content-center align-items-center'>
                        <Trash onClick={props.onDelete} href="#delete" className='m-1 hover:tw-cursor-pointer hover:tw-border hover:tw-border-white'/>
                        {!onEdit&&                        
                        <PencilSquare onClick={(e)=>{setonEdit(!onEdit)}} className='m-1 hover:tw-cursor-pointer hover:tw-border hover:tw-border-white'/>}
                        <ArrowRightSquare onClick={onMove} className='m-1 hover:tw-cursor-pointer hover:tw-border hover:tw-border-white'/>
                    </Stack>
                </Col>
                </Row>
            </Card>)}
        </div>
    );
}

export default CaseCard;