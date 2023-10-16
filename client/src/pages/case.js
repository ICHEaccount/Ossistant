import React,{useState,useEffect} from 'react';
import Axios from "axios";
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import DataPanel from '../components/dataPanel';
import Visualization from '../components/relation/Visualization';
import TimelineVisualization from '../components/timeline/timeline'

///DUMMY DATA///
const dummy = {
    "case_id": "1234567890abcdef", //requested case id
    "data":
    //neo4j node data list
    {"post":[
        {"id":"1234", 
        "property": {
        "Url":"blog.naver.com",
        "Title":"post1",
        "Created_Date": "2023-09-05",
        "Type": "naver"
        }},

        {"id":"5678", 
        "property": {
        "Url":"x.com",
        "Title":"post2",
        "Created_Date": "2023-09-06",
        "Type": "twitter"
        }}
    ],
    "user":[
        {"id":"1111",
        "property":{
        "Username": "iche",
        "Fake": "false"
        }},

        {"id":"2222",
        "property":{
        "Username": "osint",
        "Fake": "true"
        }}
    ],
    "domain":[
        {"id":"0000",
        "property":{
            "Domain":"puritipo.com"
        }}
    ]}
    
}

const Case = () => {
    const params = useParams();
    const case_id = params.case_id;
    const [case_data, setcase_data] = useState({})
    const [isLoad, setisLoad] = useState(false)



    useEffect(() => {
        Axios.get(`/data/getData/${case_id}`)
            .then((res)=>{
            if(res.data){
                // console.log(res.data);
                setcase_data(res.data.data)
                setisLoad(true)
            }else{
                console.error(res.error);
                setisLoad(false)
            }
            })        
        
        
    }, [case_id])


    return (
    <div>
        {isLoad&&<Container className='mt-3 mb-3' fluid>
        <Row>
            <Col lg={4}>
                <DataPanel case_id={case_id} caseData={case_data}/>
            </Col>
            <Col lg={8} className='tw-border-l'>
                <Visualization/>
                {/* <TimelineVisualization/> */}
            </Col>
        </Row>
        </Container>}
        
        
    </div>
    )
}

export default Case