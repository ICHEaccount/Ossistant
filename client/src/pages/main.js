import React,{useState,useEffect} from 'react';
import Axios from "axios";
import Loading from '../components/loading';
import CaseCard from '../components/case/caseCards';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import IntroCard from '../components/introCard';
import { BreadcrumbItem, Button, Container, FormControl, Row, Spinner, Toast, ToastContainer, Form, InputGroup } from 'react-bootstrap';


const Main = () => {
    const [isload, setisload] = useState(false)
    const [cases, setcases] = useState([])
    const [page, setPage] = useState(1); //페이지
    const [search, setsearch] = useState("")


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

    const CaseBox = () =>{
        if(search===""){
            return(
                <Stack gap={2} className='m-3'>
                    {isload?caseList:null}
                </Stack>
            )
        }else{
            const filteredCases = cases.filter((caseData) =>
            caseData.case_name.toLowerCase().includes(search.toLowerCase()) );
            return(
                <Stack gap={2} className='m-3 '>
                    {isload?(
                        filteredCases?.map((caseData)=>{
                            return (<CaseCard caseData={caseData} onDelete={(e) => {e.preventDefault(); deleteCase(caseData.case_id)}} />)
                        })
                    ):null}
                </Stack>
            )
        }
    }

    return (
    <div> 
        <Container className='mb-3'>
        <Row>
            <Col lg={6}>
                    <IntroCard/>
            </Col>
            <Col lg={6}>
                <InputGroup className='tw-px-1 tw-mt-4'>
                <FormControl
                    type="text"
                    value={search === "" ? null : search}
                    placeholder="Case name"
                    className="mr-sm-2"
                    onChange={(e) => setsearch(e.target.value)}
                />
                    <Button className='tw-bg-bright-peach hover:tw-bg-peach tw-border-0 tw-text-peach hover:tw-text-black'>Search</Button>
                </InputGroup>
                <div className='tw-mt-2 tw-p-1 tw-border tw-rounded-md tw-border-bright-peach tw-flex tw-flex-col tw-h-3/4 tw-overflow-y-auto'>
                    <CaseBox/>
                </div>
            </Col>
        </Row>
        

        </Container>
    </div>
    )
}

export default Main