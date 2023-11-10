import React,{useState,useEffect} from 'react';
import Axios from "axios";
import Loading from '../components/loading';
import CaseCard from '../components/case/caseCards';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import IntroCard from '../components/introCard';
import { BreadcrumbItem, Button, Container, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap';


const Main = () => {
    const [isload, setisload] = useState(false)
    const [cases, setcases] = useState([])
    const [page, setPage] = useState(1); //페이지

    useEffect(() => {
        Axios.get("/case/getCaseList")
            .then((res)=>{
            if(res.data){
                setcases(res.data.reverse())
                setisload(true)
            }else{
                alert('Backend Connection Failed')
            }
            })
        }, [isload])

    const deleteCase = (caseId) =>{
        console.log(caseId);
        console.log(cases);
        Axios.get(`/case/deleteCase/${caseId}`)
        .then((res)=>{
            console.log('res',res);
            setisload(false)
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const caseList = cases.map((caseData,idx)=>{
        return (<CaseCard caseData={caseData} onDelete={(e) => {e.preventDefault(); deleteCase(caseData.case_id)}} />)
    })

    return (
    <div className='tw-h-full tw-overflow-hidden'> 
        <Container className='mb-3'>
        <Row>
            <Col lg={6}>
                    <IntroCard/>
            </Col>
            <Col lg={6}>
                <Stack gap={2} className='m-3 tw-h-5/6 tw-overflow-auto'>
                    {isload?caseList:null}
                </Stack>
            </Col>
        </Row>
        

        </Container>
    </div>
    )
}

export default Main