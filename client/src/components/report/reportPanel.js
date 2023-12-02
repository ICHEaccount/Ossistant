import React from 'react'
import { Cone } from 'react-bootstrap-icons'
import ExportData from './exportData'

const Report = (props) => {
    const case_id = props.case_id
    return (
        <div>
            <ExportData case_id={case_id}/>
        </div>
    )
}

export default Report