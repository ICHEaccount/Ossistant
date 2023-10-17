import { ArrowRightSquare, Calendar, PersonVcard, Trash, PencilSquare } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Stack from 'react-bootstrap/esm/Stack';
import { useNavigate } from 'react-router-dom';

function CaseCard(props) {
    const navigate = useNavigate();

    const data = props.caseData

    const onMove = () =>{
        navigate(`/casepage/${data.case_id}`)
    }

    const onEdit = () =>{
        // todo
    }

    return (
    <Card>
        <Row className='m-2'>
        <Col md="11">
        <Card.Link href={`/casepage/${data.case_id}`}>
        <Card.Title>Case: {data.case_name}</Card.Title>
                <Card.Subtitle className='text-muted'>
                    <Row>
                        <Col>
                            {data.case_num}
                        </Col>
                        <Col className="d-flex align-items-center">
                            <PersonVcard className='m-1'/>
                            {data.investigator}
                        </Col>
                        <Col className="d-flex align-items-center">
                            <Calendar className='m-1'/>
                            {data.created_date.split(':')[0]}
                        </Col>
                    </Row>
                </Card.Subtitle>
                    <Card.Text>
                        {data.description}
                    </Card.Text>
        </Card.Link>
                
        </Col>
            
        <Col md="1" className="d-flex align-items-center">
            <Stack className='flex-column justify-content-center align-items-center'>
                <Trash onClick={props.onDelete} href="#delete" className='m-1'/>
                <PencilSquare onClick={onEdit} className='m-1'/>
                <ArrowRightSquare onClick={onMove} className='m-1'/>
            </Stack>
        </Col>
            </Row>
        
    </Card>
    );
}

export default CaseCard;