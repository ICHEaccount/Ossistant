import React from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';

const ProgressPanel = () => {
    return (
    <div>
        <p>Tool #1</p>
    <ProgressBar animated now={45} />
    </div>
    )
}

export default ProgressPanel