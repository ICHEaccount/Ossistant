import React, { useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import logo from '../../images/logo_textless.png';


const RunToast = (props) => {
    const newResult = props.newResult
    const [showList, setshowList] = useState({})

    const onHide = (run) =>{
        console.log(showList[run.run_id]);
        setshowList({
            ...showList,
            [run.run_id]:false
        })
    }

    // console.log(newResult);
    const toastList = newResult?.completed?.map((result,idx)=> {
        // setisnewRun(false)
        return(
        <Toast key={result.run_id} onClose={(e)=>onHide(result)} show={showList[result.run_id]===undefined} delay={3000} autohide>
            <Toast.Header className="tw-bg-bright-peach">
                <img src={logo} className="tw-rounded-sm me-2" alt="logo"  height="20" width="20"/>
                <strong className="me-auto">{`#${result.run_id} ${result.tool_name} Completed`}</strong> 
                <small>{result.run_time}</small>
            </Toast.Header>
            <Toast.Body>
                {result.results.length?`Success! ${result.results.length} new data acquired :)`:"Success! But no new data acquired :("}
            </Toast.Body>
        </Toast>
        )
    })
    const errorToast = newResult?.error?.map((result,idx)=>{
        return(
        <Toast key={result.run_id} onClose={(e)=>onHide(result)} show={showList[result.run_id]===undefined} delay={3000} autohide>
            <Toast.Header className="tw-bg-peach">
                <img src={logo} className="tw-rounded-sm me-2" alt="logo"  height="20" width="20"/>
                <strong className="me-auto">{`#${result.run_id} ${result.tool_name} ERROR`}</strong> 
                <small>{result.run_time}</small>
            </Toast.Header>
            <Toast.Body>
                {"Error! Something went wrong :("}
            </Toast.Body>
        </Toast>
        )
    })
    return (
        <ToastContainer position='bottom-end' className='p-2'>
            {toastList}
            {errorToast}
        </ToastContainer>
    
    )
}

export default RunToast