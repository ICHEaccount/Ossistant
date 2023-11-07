import React from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import logo from '../../images/logo_textless.png';


const RunToast = (props) => {
    const newResult = props.newResult
    const toastList = newResult?.completed?.map((result)=> {
        return(
        <Toast>
            <Toast.Header>
                <img src={logo} className="rounded me-2" alt="" width={30}/>
                <strong className="me-auto">{`#${result.run_id} ${result.tool_name} Completed`}</strong> 
                <small>{result.run_time}</small>
            </Toast.Header>
            <Toast.Body>
                {result.results.length?`Success! ${result.results.length} new data acquired :)`:"Success! But no new data acquired :("}
            </Toast.Body>
        </Toast>
        )
    })
    return (
        <ToastContainer position='bottom-end'>
            {toastList}
        </ToastContainer>
    
    )
}

export default RunToast