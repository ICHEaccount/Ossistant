import React,{useState,useEffect} from 'react';
import Axios from "axios";
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import DataPanel from '../components/data/dataPanel';
import VisualPanel from '../components/visualPanel';
import { useSelector } from 'react-redux';
import RunToast from '../components/run/runToast';
import { Button, Toast, ToastContainer } from 'react-bootstrap';
import BetaToast from '../components/betaToast';


    const Case = () => {
        const selected = useSelector(state => state.node.selected)
        const params = useParams();
        const case_id = params.case_id;
        const [case_data, setcase_data] = useState({})
        const [isLoad, setisLoad] = useState(false)
        const [toolResult, settoolResult] = useState({})
        const [newResult, setnewResult] = useState({})
        const [isDone, setisDone] = useState(false)
        const [newData, setnewData] = useState([])
        const [isnewRun, setisnewRun] = useState(false)
        const [isLoaded, setisLoaded] = useState(false)

        useEffect(() => {
            Axios.get(`/data/getData/${case_id}`)
                .then((res)=>{
                if(res.data){
                    // console.log(res.data);
                    if(isDone){
                    const newDataList = {};
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
                    
                    // console.log(newDataList);
                    setnewData(newDataList)}
                    setcase_data(res.data.data)
                    setisLoad(true)
                    setisDone(false)
                }else{
                    console.error(res.error);
                    setisLoad(false)
                }
                })
            
        }, [case_id,isDone,selected])

        useEffect(() => {
            
                const interval = setInterval(() => {
                    Axios.get(`/tools/getToolState/${case_id}`)
                        .then((res) => {
                            // console.log(res.data);
                            const newResultList={
                                'completed':[],
                                'ready':[],
                                'running':[],
                                'error':[]
                            }
                            Object.keys(res.data).forEach((status)=>{
                                const statusData = res.data[status]
                                if(toolResult[status]){  
                                    statusData.forEach((item) => {
                                        newResultList[status]=[]
                                        const isOldData = toolResult[status].some((oldItem) => oldItem.run_id === item.run_id);
                                        if (!isOldData) {
                                            newResultList[status].push(item);
                                        }
                                    })
                                } else {
                                    newResultList[status]=res.data[status]
                                }
                            })
                            setnewResult(newResultList)
                            settoolResult(res.data)
                            console.log(newResultList);
                            //new completed run exists
                            if(newResultList.completed.length){
                                setisDone(true);
                                
                            }
                            if(newResultList.ready.length===0 && newResultList.running.length===0){
                                clearInterval(interval);
                                setisnewRun(false);
                            }
                            setisLoaded(true)
                        })
                        .catch(error => {
                            clearInterval(interval);
                            console.log(error);
                            setisLoaded(true)
                        });
                }, 3000); // 3초마다 확인
            

        }, [isnewRun])
        


        return (
        <div>
            {(isLoad&&isLoaded)&&<Container className='mt-2 mb-3 pb-2 pt-2' fluid>
            <Row>
                <Col lg={4}>
                    <DataPanel case_id={case_id} caseData={case_data} toolResult={toolResult} newData={newData} newRun={setisnewRun}/>
                </Col>
                <Col lg={8} className='tw-border-l'>
                    <VisualPanel isDone={isDone}/>
                </Col>
            </Row>
            </Container>}
            {isLoaded&&<RunToast newResult={newResult}/>}
            <BetaToast/>
            
        </div>
        )
    }

    export default Case