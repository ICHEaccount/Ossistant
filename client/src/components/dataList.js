import  Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataCard from './dataCard';
import lbs from '../labels';


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
    ]}
    
}



const DataList = (props) => {
    const case_id = props.case_id
    const [caseData, setcaseData] = useState({})
    const labels = Object.keys(lbs)
    const [isLoad, setisLoad] = useState(false)



    useEffect(() => {
        // Axios.get(`/data/getData/${case_id}`)
        //     .then((res)=>{
        //     if(res.data){
        //         setcaseData(res.data.data)
        //         setisLoad(true)
        //     }else{
        //         console.error(res.error);
        //         setisLoad(false)
        //     }
        //     })
        setcaseData(dummy.data)
        
        
        
    }, [caseData, case_id])

    

    const dataCardList=labels.map((label)=>{
        const labelData = caseData[label]
        if (labelData){
        return (<Tab eventKey={label} title={label}>
            <DataCard nodes={labelData} label={label}/>
        </Tab>)}
        else{
        return (<Tab eventKey={label} title={label}>
            <DataCard nodes={null} label={label}/>
        </Tab>)}
    })


    return (
    <div>
        <Tabs>
        {dataCardList}
        </Tabs>

    </div>
    )
}

export default DataList