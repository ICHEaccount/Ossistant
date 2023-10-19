    import React,{useState,useEffect} from 'react';
    import Axios from "axios";
    import { useParams } from 'react-router-dom';
    import Row from 'react-bootstrap/esm/Row';
    import Col from 'react-bootstrap/esm/Col';
    import Toast from 'react-bootstrap/Toast';
    import Container from 'react-bootstrap/esm/Container';
    import DataPanel from '../components/dataPanel';
    import Visualization from '../components/relation/Visualization';
    import TimelineVisualization from '../components/timeline/timeline'
    import { Alert, Button, Stack } from 'react-bootstrap';
import ToolResultBanner from '../components/toolResultBanner';


    const Case = () => {
        const params = useParams();
        const case_id = params.case_id;
        const [case_data, setcase_data] = useState({})
        const [isLoad, setisLoad] = useState(false)
        const [toolState, settoolState] = useState("none")
        // const [toolResult, settoolResult] = useState([])
        const [toolError, settoolError] = useState({})
        const [isDone, setisDone] = useState(false)
        const [newData, setnewData] = useState([])

        useEffect(() => {
            Axios.get(`/data/getData/${case_id}`)
                .then((res)=>{
                if(res.data){
                    // console.log(res.data);
                    if(isDone){const newDataList = {};
                    Object.keys(res.data.data).forEach((label) => {
                        if(case_data[label]){
                            res.data.data[label].forEach((item) => {
                                newDataList[label]=[]
                                const isOldData = case_data[label].some((oldItem) => oldItem.node_id === item.node_id);
                                if (!isOldData) {
                                    newDataList[label].push(item);
                                }
                            })
                        }else{
                            newDataList[label]=res.data.data[label]
                        }
                        }
                    );
                    
                    console.log(newDataList);
                    setnewData(newDataList)}
                    setcase_data(res.data.data)
                    setisLoad(true)
                }else{
                    console.error(res.error);
                    setisLoad(false)
                }
                })
            
        }, [case_id,isDone])

        const toolrunner = (run_id) =>{
            const interval = setInterval(() => {
                Axios.get(`/tools/getToolState/${run_id}`)
                    .then(response => {
                    if (response.data.state === 'completed') {
                        clearInterval(interval); // 작업이 완료되면 인터벌 해제
                        // settoolResult(response.data.result);
                        settoolState('completed');
                        setisDone(true);
                    } else if (response.data.state === 'running') {
                        settoolState('running');
                    } else {
                        clearInterval(interval);
                        settoolState('unknown');
                    }
                    })
                    .catch(error => {
                    clearInterval(interval);
                    settoolState('error');
                    setisDone(true);
                    settoolError(error)
                    });
            }, 1000); // 1초마다 확인
        }


        return (
        <div>
            {isLoad&&<Container className='mt-3 mb-3 pb-2 pt-2' fluid>
            <Row>
                <Col lg={4}>
                    <ToolResultBanner toolState={toolState} error={toolError}/>
                    <DataPanel case_id={case_id} caseData={case_data} toolrunner={toolrunner} newData={newData}/>
                </Col>
                <Col lg={8} className='tw-border-l'>
                    <Container className="tw-flex-grow">
                    <div className="tw-flex tw-border tw-rounded-md mb-2">
                        <Visualization isDone={isDone}/>
                    </div>
                    <div className="tw-flex tw-border tw-rounded-md tw-flex-grow tw-justify-center">
                        <TimelineVisualization isDone={isDone}/>
                    </div>
                    </Container>

                </Col>
            </Row>
            </Container>}
            
            
        </div>
        )
    }

    export default Case