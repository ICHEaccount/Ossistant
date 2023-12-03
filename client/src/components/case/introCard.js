import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Card from 'react-bootstrap/Card';
import CreateCase from './createCase.js'

const IntroCard = () => {
    return (
    <Card className='tw-m-3 tw-border-0'>
        <Card.Body>
            <Card.Title className='tw-bg-gradient-to-br tw-text-2xl tw-font-extrabold tw-from-navy tw-to-peach tw-inline-block tw-text-transparent tw-bg-clip-text'>OSSISTANT</Card.Title>
            {/* <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle> */}
            <Card.Text>
            A combination of OSINT and assistant, OSSISTANT specializes in cybercrime profiling. It consists of a Chrome browser extension and a Docker-based web dashboard to assist investigators. You can manage the collected information on the OSSISTANT webpage and visualize it as a relation and timeline graph. You can also run the built-in open-source OSINT tool based on the information you have gathered.
            </Card.Text>
            <CreateCase/>
        </Card.Body>
        
    </Card>          
    )
}

export default IntroCard