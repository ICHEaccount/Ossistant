import Axios from "axios";
import React from 'react'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../images/logo_textless.png';


const BetaToast = () => {
    const navigate = useNavigate();
    const params = useParams();
    const case_id = params.case_id;

    const endTest = () =>{
        Axios.get(`/case/deleteCase/${case_id}`)
        .then((res)=>{
            console.log('res',res);
            navigate(`/`)
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return (
    <ToastContainer position='bottom-end' className='p-2'>
        <Toast>
            <Toast.Header className="tw-bg-bright-peach">
            <img src={logo} className="tw-rounded-sm me-2" alt="logo"  height="20" width="20"/>
            <strong className="me-auto">OSSISTANT</strong>
            <small>Team ICHE</small>
            </Toast.Header>
            <Toast.Body>
                <Button onClick={endTest} variant="outline-primary" >
                Finish Beta Test
                </Button>
            </Toast.Body>
        </Toast>
    </ToastContainer>
    )
}

export default BetaToast