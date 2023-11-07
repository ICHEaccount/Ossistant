import React from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { ClipboardCheck, Envelope } from 'react-bootstrap-icons'
import {useNavigate} from 'react-router-dom';


const Test = () => {
    const navigate = useNavigate();

    const move = () =>{
        navigate(`/main`)
    }
    return (
        <Container className='mt-2'>
            <Row className='justify-content-center'>
                <Col lg={10}>
                <Card className='tw-w-full tw-h-full mt-2'>
                    <Card.Body>
                    <Card.Title className='tw-text-center'>OSSISTANT Beta Test</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted tw-text-end">Team ICHE</Card.Subtitle>
                    <Card.Text>
                        <p>Tester: Former and Current Cybercrime Investigators </p>
                        <p>Period: 2023-11-15 ~ 2023-11-21</p>
                    </Card.Text>
                    </Card.Body>
                    <Card.Body>
                    <Card.Text>
                    Hello, we are a team conducting a project on 'Developing Dark Web OSINT Tool for Criminal Profiling' as part of the Korean cyber security leadership program, <a href='https://www.kitribob.kr/' rel='noreferrer' target='_blank'>BoB</a>.
                    </Card.Text>
                    </Card.Body>
                    <Card.Body>
                    <Card.Text>
                        OSSISTANT is a user-friendly OSINT tool which contains browser extension to assist with evidence collection from web pages and web dashboard to visualize collected information, and run automated OSINT tool execution.
                    </Card.Text>
                    </Card.Body>
                    <Card.Body>
                    <Card.Text>
                    <h4>Contact </h4> 
                    <Card.Link href="#" rel='noreferrer' target='_blank'> <ClipboardCheck size={12} className='tw-inline-block'/> Evaluation Google Form</Card.Link>
                    <Card.Link href="mailto:pocky19950608@gmail.com">  <Envelope size={12} className='tw-inline-block'/> pocky19950608@gmail.com </Card.Link>
                    </Card.Text>
                    </Card.Body>
                    <Card.Body>
                    <Button variant="primary" className='tw-justify-self-center' href='/main'>Start</Button>
                    </Card.Body>
                </Card>

                </Col>
            </Row>
        </Container>
    
    )
}

export default Test