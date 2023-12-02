import React, { useRef, useState } from 'react'
import { Button, Card, FormControl, InputGroup, Spinner } from 'react-bootstrap'
import Axios from 'axios'

//dummy
const createReport = async () =>{
    return true
}

const ExportReport = (props) => {
    const case_id = props.case_id
    const [filename, setfilename] = useState("")
    const [state, setstate] = useState("ready")
    const download = useRef(null)

    const reqReport = async () =>{
        const res = await createReport()
        if(res){
            // const interval = setInterval(()=>{
            //     Axios.get(`/export/getReportState/${case_id}`)
            //     .then((res)=>{
            //         if(res.data.state==="running"){
            //             setstate("running") 
            //         }else{ //completed
            //             setstate("completed")
            //             const href = URL.createObjectURL(res.data.file);
            //             const link = document.createElement('a')
            //             link.href=href;
            //             link.setAttribute('download',`${filename}.docx`)
            //             document.body.appendChild(link)
            //             download.current=link
            //             clearInterval(interval)
            //             // document.body.removeChild(link)
            //             // URL.revokeObjectURL(href)
            //         }
            //     })
            //     .catch((err)=>{
            //         setstate("error")
            //         console.log(err);
            //         clearInterval(interval)
            //     })
            // },3000)
            setstate("error")
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