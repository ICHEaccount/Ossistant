import React from 'react'
import { Container } from 'react-bootstrap'
import RelationGraph from './visualization/relation/relationGraph'
import Timeline from './visualization/timeline/wholeTimeline'
//import Timeline from './visualization/timeline/timeline'

const VisualPanel = (props) => {
    const isDone = props.isDone
    return (
        <Container className="tw-flex-grow">
        <div className="tw-flex tw-border tw-rounded-md mb-2">
            <RelationGraph isDone={isDone}/>
        </div>
        <div className="tw-flex tw-border tw-rounded-md tw-flex-grow tw-justify-center">
            <Timeline isDone={isDone}/>
        </div>
        </Container>
    )
}

export default VisualPanel