import React from 'react'
import ExportData from './exportData'
import ExportReport from './exportReport'
import { Stack } from 'react-bootstrap'

const Report = (props) => {
    const case_id = props.case_id
    const visRef = props.visRef
    return (
        <Stack gap={2}>
            <ExportData case_id={case_id}/>
            <ExportReport case_id={case_id} visRef={visRef}/>
        </Stack>
    )
}

export default Report