import React from 'react'
import DomainTimeline from './domainTimeline'

const Timeline = (props) => {
  const isDone = props.isDone
  return (
    <div>
      {/* Enter Each Timeline Here */}
      <DomainTimeline isDone={isDone}/>
    </div>
  )
}

export default Timeline