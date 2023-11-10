import  Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import lbs, { category } from '../../labels';
import ToolCard from './toolCard';
import Loading from '../loading';
import { useSelector, useDispatch } from 'react-redux'
import {labelChange, categoryChange} from '../../reducers/node'
import { Accordion } from 'react-bootstrap';

const ToolList = (props) => {
    const selcted_label = useSelector(state => state.node.label)
    const selected_category = useSelector(state =>state.node.category)
    const dispatch = useDispatch()
    const case_id = props.case_id
    const labels = Object.keys(lbs)
    const caseData = props.caseData
    const [isload, setIsload] = useState(false)
    const [tools, settools] = useState([])

    useEffect(() => {
        Axios.get(`/tools/getToolList`)
            .then((res)=>{
            if(res.data){
                // console.log(res.data);
                settools(res.data)
                setIsload(true)
            }else{
                console.error(res.error);
                setIsload(false)
            }
            })
        // settools(dummy)
    }, [])

    const categoryList = Object.keys(category).map((tag)=>{
        const list = category[tag]
        const toolCardList = list.map((label)=>{
            const labelTools = tools[label]
            return <Accordion.Item eventKey={label}>
                <Accordion.Header>{label}</Accordion.Header>
                <Accordion.Body className='tw-mx-[-25px] tw-my-[-10px]'>
                <ToolCard case_id={case_id} labelTools={labelTools!==undefined?labelTools:null} labelData={caseData[label]} label={label} newRun={props.newRun}/>
                </Accordion.Body>
                </Accordion.Item>
        })
        return <Tab eventKey={tag} title={tag}>
            <Accordion activeKey={selcted_label} onSelect={(k)=>dispatch(labelChange(k))} flush>
                    {toolCardList}
            </Accordion>
        </Tab>
    })
    


    return (
    <div>
        <Tabs variant='pills' activeKey={selected_category} justify className='mb-2' onSelect={(k)=>{dispatch(categoryChange(k))}}>
        {categoryList}
        </Tabs>

    </div>
    )
}

export default ToolList