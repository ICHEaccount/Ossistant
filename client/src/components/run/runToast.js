import React, { useState } from 'react'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import logo from '../../images/logo_textless.png';
import { useDispatch } from 'react-redux';
import {changeResultView,panelChange,changeRunView} from '../../reducers/node'

const RunToast = (props) => {
    const newResult = props.newResult
    const dispatch = useDispatch()
    const [showList, setshowList] = useState({})

    const toResult = (result,status) =>{
        dispatch(changeResultView({result:result,status:status}))
        dispatch(panelChange("run-list"))
        dispatch(changeRunView("details"))
    }

    const onHide = (run) =>{
        // console.log(showList[run.run_id]);
        setshowList({
            ...showList,
            [run.run_id]:false
        })
    }

    // console.log(newResult);
    const toastList = newResult?.completed?.map((result,idx)=> {
        // setisnewRun(false)
        console.log(result.results);
        let array = result.results.filter((item,idx)=>{return item.result.value!=null&&item.result.value!==""})
        
        return(
        <Toast key={result.run_id} onClose={(e)=>onHide(result)} show={showList[result.run_id]===undefined} delay={3000} autohide>
            <Toast.Header className="tw-bg-bright-peach">
                <img src={logo} className="tw-rounded-sm me-2" alt="logo"  height="20" width="20"/>
                <strong className="me-auto">{result.tool_name} Completed </strong> 
                <small>{result.runtime}</small>
            </Toast.Header>
            <Toast.Body>
                {result.results.length?`Success! ${array.length} new data acquired :)`:"Success! But no new data acquired :("}
            </Toast.Body>
            <Button variant="disable" className='m-2 tw-bg-bright-peach hover:tw-bg-peach hover:tw-text-black tw-border-0 tw-text-peach' onClick={()=>toResult(result,"completed")}>Check Result</Button>
        </Toast>
        )
    })
    const errorToast = newResult?.error?.map((result,idx)=>{
        // console.log(result);
        return(
        <Toast key={result.run_id} onClose={(e)=>onHide(result)} show={showList[result.run_id]===undefined} delay={3000} autohide>
            <Toast.Header className="tw-bg-peach">
                <img src={logo} className="tw-rounded-sm me-2" alt="logo"  height="20" width="20"/>
                <strong className="me-auto">{result.tool_name} ERROR</strong> 
                <small>{result.runtime}</small>
            </Toast.Header>
            <Toast.Body>
            {"Error! Something went wrong :( Check out the error message"}
            </Toast.Body>
            <Button variant="disable" className='m-2 tw-bg-bright-peach hover:tw-bg-peach hover:tw-text-black tw-border-0 tw-text-peach' onClick={()=>toResult(result,"error")}>Check Result</Button>
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