import React from 'react'
import DomainTimeline from './domainTimeline'
import { Col, Nav, Row, Tab } from 'react-bootstrap'
import { Archive, Globe2, PersonCircle } from 'react-bootstrap-icons'
import WholeTimeline from './wholeTimeline'
import SuspectTimeline from './suspectTimeline'

const Timeline = (props) => {
    const isDone = props.isDone
    return (
    <Tab.Container defaultActiveKey="whole">
        <Row>
        <Col sm={3} className=''>
            <Nav variant="pills" fill justify className="flex-column p-1 tw-border tw-rounded-md">
                <Nav.Item>
                <Nav.Link eventKey="whole" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                        <Archive size="30px" /> Whole
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="suspect" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                        <PersonCircle size="30px"/> Suspect
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="domain" className='tw-w-full tw-h-full d-flex justify-content-center align-items-center'>
                        <Globe2 size="30px"/> Domain
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Col>
        <Col sm={9}>
            <Tab.Content>
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