import React,{useState,useEffect, useRef} from 'react';
import Axios from "axios";
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import DataPanel from '../components/data/dataPanel';
import VisualPanel from '../components/visualPanel';
import { useSelector } from 'react-redux';
import RunToast from '../components/run/runToast';
import BetaToast from '../components/betaToast';


    const Case = () => {
        const selected = useSelector(state => state.node.selected)
        const params = useParams();
        const case_id = params.case_id;
        const [case_data, setcase_data] = useState({})
        const [isLoad, setisLoad] = useState(false)
        const [toolResult, settoolResult] = useState({})
        const [newResult, setnewResult] = useState({})
        const [isnewResult, setisnewResult] = useState(false)
        const [isDone, setisDone] = useState(false)
        const [newData, setnewData] = useState([])
        // const [isnewRun, setisnewRun] = useState(false)
        const [activeRuns, setactiveRuns] = useState([])
        const [isLoaded, setisLoaded] = useState(false)
        const [istoolLoad, setistoolLoad] = useState(false)
        const [tools, settools] = useState([])
        const intervalRef = useRef(null);
        const prevToolResultRef = useRef(toolResult);
        const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

        //Get initial data to display data panel
        useEffect(() => {
            Axios.get(`/tools/getToolList`)
                .then((res)=>{
                if(res.data){
                    // console.log(res.data);
                    settools(res.data)
                    setistoolLoad(true)
                }else{
                    console.error(res.error);
                    setistoolLoad(false)
                }
                })
            // settools(dummy)
            Axios.get(`/tools/getToolState/${case_id}`)
                .then((res) => {
                    settoolResult(res.data)
                    // console.log(res.data);
                    setisLoaded(true)
                })
                .catch(error => {
                    console.log(error);
                    setisLoaded(true)
                });
            setisDone(false)
        }, [])
        

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
            
        }, [isDone,selected])

        useEffect(() => {
            if(activeRuns.length && intervalRef.current === null ){
                    intervalRef.current = setInterval(() => {
                        Axios.get(`/tools/getToolState/${case_id}`)
                            .then((res) => {
                                if(Object.keys(toolResult)&&!isEqual(res.data,prevToolResultRef.current)){
                                    const newResultList={
                                        'completed':[],
                                        'ready':[],
                                        'running':[],
                                        'error':[]
                                    }
                                    Object.keys(res.data).forEach((status)=>{
                                        const statusData = res.data[status]
                                        // console.log(statusData);
                                        if(toolResult[status]){  
                                            statusData.forEach((item) => {
                                                newResultList[status]=[]
                                                const isOldData = toolResult[status].some((oldItem) => oldItem.run_id === item.run_id);
                                                if (!isOldData) {
                                                    newResultList[status].push(item);
                                                }
                                                if(status==="completed"||status==="error"){
                                                    let newActiveRuns = activeRuns
                                                    if(item.run_id in activeRuns){
                                                        newActiveRuns.filter((i)=> i!==item.run_id)
                                                    }
                                                    setactiveRuns(newActiveRuns)
                                                }
                                            })
                                        } else {
                                            newResultList[status]=statusData
                                        }
                                    })
                                    setnewResult(newResultList)
                                     // Update the ref with the latest toolResult
                                    prevToolResultRef.current = res.data;
                                    
                                    settoolResult((prevToolResult) => {
                                        // Update the state only if it's different from the previous state
                                        if (!isEqual(prevToolResult, res.data)) {
                                            return res.data;
                                        }
                                        return prevToolResult;
                                    });
                                    // console.log(newResultList);
                                    //new completed run exists
                                    if(newResultList.completed.length){
                                        setisDone(true);
                                        // setisnewRun(false)
                                        setisnewResult(true)
                                    }
                                    if(newResultList.error.length){
                                        setisDone(true);
                                        // setisnewRun(false)
                                        setisnewResult(true)
                                    }
                                    if(newResultList.ready.length===0 && newResultList.running.length===0){
                                        clearInterval(intervalRef.current);
                                        intervalRef.current = null;
                                        console.log("clear interval");
                                        // setisnewRun(false);
                                    }
                                }
                                
                                setisLoaded(true)
                            })
                            .catch(error => {
                                clearInterval(intervalRef.current);
                                intervalRef.current = null;
                                console.log(error);
                                setisLoaded(true)
                            });
                    }, 5000); // 3초마다 확인
                

            }
                
            return() =>{
                clearInterval(intervalRef.current);
            }

        }, [activeRuns])
        

        const DataPanelMemoized = React.memo(DataPanel);
        return (
        <div>
            {(isLoad&&istoolLoad)&&<Container className='mt-2 mb-3 pb-2 pt-2' fluid>
            <Row>
                <Col lg={4}>
                    <DataPanelMemoized case_id={case_id} caseData={case_data} toolList={tools} toolResult={toolResult} newData={newData} newRun={setactiveRuns}/>
                </Col>
                <Col lg={8} className='tw-border-l'>
                    <VisualPanel isDone={isDone}/>
                </Col>
            </Row>
            </Container>}
            {isLoaded?<RunToast newResult={newResult} isnewRun={isnewResult}/>:null}
            <BetaToast/>
            
        </div>
        )
    }

    export default Case