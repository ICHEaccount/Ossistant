import React,{useState,useEffect} from 'react';
import Axios from "axios";
import Loading from '../components/loading';
import CaseCard from '../components/caseCards';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import IntroCard from '../components/introCard';


const Main = () => {
    const [isload, setisload] = useState(true)
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
        }, [])

    const deleteCase = async (caseId) =>{
        try {
            const res= await Axios.get(`/case/deleteCase/${caseId}`)
            console.log('res',res);
            setcases((prevCases) => prevCases.filter((caseData) => caseData.case_id !== caseId));
        } catch (error) {
            console.error(error);
        }
    }

    const caseList = cases.map((caseData,idx)=>{
        return (<CaseCard caseData={caseData} onDelete={(e) => {e.preventDefault(); deleteCase(caseData.case_id)}} />)
    })

    return (
    <div>
        <Container className='mb-3'>
        <Row >
            <Col lg={6}>
                    <IntroCard/>
            </Col>
            <Col lg={6}>
                <Stack gap={3} className='m-3'>
                    {isload?caseList:<Loading/>}
                </Stack>
                
                
            </Col>
        </Row>

        </Container>
    </div>
    )
}

export default Main