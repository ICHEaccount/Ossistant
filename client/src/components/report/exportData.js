import React, { useState } from 'react'
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap'
import Axios from 'axios'

const ExportData = (props) => {
    const case_id=props.case_id
    const [filename, setfilename] = useState("export")
    const reqExcel = () =>{
        // console.log(filename);
        const config = {
            method:"GET",
            url:`/export/excel/${case_id}`,
            responseType: "blob"
        }
        Axios(config)
        .then((res)=>{
            const href = URL.createObjectURL(res.data);
            const link = document.createElement('a')
            link.href=href;
            link.setAttribute('download',`${filename}.xlsx`)
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(href)
        })
    }
    return (
    <Card className='m-1'>
        <Card.Header className='tw-bg-bright-peach'>
            Export Collected Data
        </Card.Header>
        <Card.Body>
            <InputGroup>
            <FormControl
            placeholder='File name'
            value={filename}
            onChange={(e)=>setfilename(e.target.value)}
            />
            <InputGroup.Text className='tw-bg-white'>.xlsx</InputGroup.Text>
            <Button variant="disable" className='tw-bg-bright-peach hover:tw-bg-peach hover:tw-text-bright-peach tw-border-0 tw-text-peach' onClick={reqExcel}>export</Button>
            </InputGroup>
        </Card.Body>
    </Card>
    )
}

export default ExportData