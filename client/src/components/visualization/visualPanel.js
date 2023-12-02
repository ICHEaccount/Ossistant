import React from 'react'
import { Container } from 'react-bootstrap'
import RelationGraph from './relation/relationGraph'
// import Timeline from './visualization/timeline/domainTimeline'
import Timeline from './timeline/timeline'


const VisualPanel = (props) => {
    const isDone = props.isDone
    const visRef = props.visRef
    return (
        <Container className="tw-flex-grow">
        <div className="tw-flex tw-border tw-rounded-md mb-2">
            <RelationGraph isDone={isDone} networkRef={visRef.relation}/>
        </div>
        <div className="tw-border tw-rounded-md tw-flex-grow tw-justify-start tw-mb-2">
            <Timeline isDone={isDone} visRef={visRef}/>
        </div>
        </Container>
    )
}

export default VisualPanel