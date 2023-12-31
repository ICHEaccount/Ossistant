import React, { useRef, useState } from 'react'
import { Button, Card, FormControl, InputGroup, Spinner } from 'react-bootstrap'
import Axios from 'axios'
import createReport from '../visualization/createReport'

const ExportReport = (props) => {
    const case_id = props.case_id
    const [filename, setfilename] = useState("")
    const [state, setstate] = useState("ready")
    const download = useRef(null)
    const visRef = props.visRef

    const reqReport = async () =>{
        const relation = await createReport(case_id,visRef.relation,1)
        console.log("relation",relation);
        const whole = await createReport(case_id,visRef.whole,2) 
        console.log("whole",whole);
        const suspect = await createReport(case_id,visRef.suspect,3) 
        console.log("suspect",suspect);
        const domain = await createReport(case_id,visRef.domain,4) 
        console.log("domain",domain);
        const res = relation &&whole&&suspect&&domain
        console.log(res);

        if(res){
            const config = {
                method:"GET",
                url:`/export/report/${case_id}`,
                responseType: "blob"
            }
            Axios(config)
            .then((res)=>{
                console.log(res.data);
                const href = URL.createObjectURL(res.data)
                const link = document.createElement('a')
                link.href = href;
                link.setAttribute('download',`${filename===""?"export":filename}.docx`)
                document.body.appendChild(link)
                download.current=link
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(href)
            })
            .catch((err)=>{
                console.log(err);
            })

            setstate("ready")
        }else{
            setstate("error")
        }
    }

    const downloadReport = () =>{
        // download.current.click()
        // document.body.removeChild(download.current)
        console.log("clicked");
    } 

    return (
    <Card className='m-1'>
        <Card.Header className='tw-bg-bright-peach'>
            Create New Report
        </Card.Header>
        <Card.Body>
        <InputGroup>
            <FormControl
            placeholder='File name'
            value={filename}
            onChange={(e)=>setfilename(e.target.value)}
            readOnly={state==="running"}
            />
            <InputGroup.Text className='tw-bg-white'>.docx</InputGroup.Text>
            <Button variant="disable" disabled={state==="running"} className='disabled:tw-bg-bright-peach tw-bg-bright-peach hover:tw-bg-peach hover:tw-text-bright-peach tw-border-0 tw-text-peach' onClick={reqReport}>create</Button>
        </InputGroup>
        {state!=="ready"&&(
                    <div className='mt-2 tw-flex tw-justify-center'>
                        {state==="running"&&
                        <div>
                            Creating...
                            <Spinner animation="border" role="status" size='sm'><span className="visually-hidden">Loading...</span></Spinner>
                        </div>}
                        {state==="completed"&&<Button variant="disable" onClick={downloadReport} className=' disabled:tw-bg-bright-peach tw-bg-bright-peach hover:tw-bg-peach hover:tw-text-bright-peach tw-border-0 tw-text-peach' download={`${filename}.docx`}>Download</Button>}
                        {state==="error"&&<p className='tw-text-peach'>Something went Wrong :( Try Again</p>}
                    </div>
            
        )}
        </Card.Body>
    </Card>
    )
}

export default ExportReport