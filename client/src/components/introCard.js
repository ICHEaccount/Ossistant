import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import CreateCase from './createCase'
import Card from 'react-bootstrap/Card';

const IntroCard = () => {
    return (
    <div>
        <Container className='m-3'>
        <Card >
        <Card.Body>
            <Card.Title>OSSISTANT</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">OSINT Tool for Cyber Profiling</Card.Subtitle>
            <Card.Text>
            OSSISTANT, a user-friendly browser extension to assist with evidence collection from web pages, visualize collected information, and automate OSINT tool execution. 
            </Card.Text>
            <CreateCase/>
        </Card.Body>
        
        </Card>          
            
        </Container>

    </div>
    )
}

export default IntroCard