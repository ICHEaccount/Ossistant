import React,{useState,useEffect} from 'react';
import Axios from "axios";
import Loading from '../components/loading';
import CaseCard from '../components/case/caseCards';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import IntroCard from '../components/introCard';
import { Container, Row, Spinner } from 'react-bootstrap';


const Main = () => {
    const [isload, setisload] = useState(false)
    const [cases, setcases] = useState([])

    useEffect(() => {
        Axios.get("/case/getCaseList")
            .then((res)=>{
            if(res.data){
                setcases(res.data)
                setisload(true)
                console.log(res.data);
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
    <div>
        <Container className='mb-3'>
        <Row>
            <Col lg={6}>
                    <IntroCard/>
            </Col>
            <Col lg={6}>
                <Stack gap={3} className='m-3'>
                    {isload?caseList:null}
                </Stack>
                
                
            </Col>
        </Row>

        </Container>
    </div>
    )
}

export default Main