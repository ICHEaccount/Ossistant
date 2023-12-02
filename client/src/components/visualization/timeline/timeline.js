import React from 'react'
import DomainTimeline from './domainTimeline'
import { Col, Nav, Row, Tab } from 'react-bootstrap'
import { Archive, Globe2, PersonCircle } from 'react-bootstrap-icons'
import WholeTimeline from './wholeTimeline'
import SuspectTimeline from './suspectTimeline'

const Timeline = (props) => {
    const isDone = props.isDone
    return (
    <Tab.Container defaultActiveKey="whole" transition={false}>
        <Row>
        <Col md={2} className=''>
            <Nav variant="pills" fill justify className="flex-column p-1">
                <Nav.Item>
                <Nav.Link eventKey="whole" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                        <Archive size="30px" className='tw-mr-2'/> Whole
                </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="suspect" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                        <PersonCircle size="30px" className='tw-mr-2'/> Suspect
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="domain" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                        <Globe2 size="30px" className='tw-mr-2'/> Domain
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Col >
        <Col md={10} className='flex tw-border-l tw-mx-[-10px]'>
            <Tab.Content className='tw-grow tw-pr-5 tw-pb-1 tw-pt-2'>
            <Tab.Pane eventKey="whole"><WholeTimeline isDone={isDone}/></Tab.Pane>
            <Tab.Pane eventKey="suspect"><SuspectTimeline isDone={isDone}/></Tab.Pane>
            <Tab.Pane eventKey="domain"><DomainTimeline isDone={isDone}/></Tab.Pane>
            </Tab.Content>
        </Col>
        </Row>
    </Tab.Container>
    )
}

export default Timeline