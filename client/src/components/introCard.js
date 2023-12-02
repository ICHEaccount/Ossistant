import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Card from 'react-bootstrap/Card';
import CreateCase from './case/createCase.js'

const IntroCard = () => {
    return (
    <Card className='tw-m-3 tw-border-bright-peach'>
        <Card.Body>
            <Card.Title>OSSISTANT</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">OSINT Tool for Cyber Profiling</Card.Subtitle>
            <Card.Text>
            OSSISTANT, a user-friendly browser extension to assist with evidence collection from web pages, visualize collected information, and automate OSINT tool execution. 
            </Card.Text>
            <CreateCase/>
        </Card.Body>
        
    </Card>          
    )
}

export default IntroCard