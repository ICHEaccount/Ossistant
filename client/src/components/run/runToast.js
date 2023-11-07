import React from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import logo from '../../images/logo_textless.png';


const RunToast = (props) => {
    const newResult = props.newResult
    const toastList = newResult?.map((result)=> {
        return(
            <Toast>
        <Toast.Header>
            <img src={logo} className="rounded me-2" alt="" width={30}/>
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
    </Toast>
        )
    })
    return (
        <ToastContainer>
            {toastList}
        </ToastContainer>
    
    )
}

export default RunToast