import React from 'react'
import { Container } from 'react-bootstrap'
import RelationGraph from './visualization/relation/relationGraph'
// import Timeline from './visualization/timeline/domainTimeline'
import Timeline from './visualization/timeline/timeline'


const VisualPanel = (props) => {
    const isDone = props.isDone
    return (
        <Container className="tw-flex-grow">
        <div className="tw-flex tw-border tw-rounded-md mb-2">
            <RelationGraph isDone={isDone}/>
        </div>
        <div className="tw-border tw-rounded-md tw-flex-grow tw-justify-start tw-mb-2">
            <Timeline isDone={isDone}/>
        </div>
        </Container>
    )
}

export default VisualPanel