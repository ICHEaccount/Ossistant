import React,{useState,useEffect} from 'react';
import Axios from "axios";
import { useParams } from 'react-router-dom';
import DataList from '../components/dataList';
import RelationGraph from '../components/relationGraph';
import Tools from '../components/tools';
import Timeline from '../components/timeline';
import ProgressPanel from '../components/progressPanel'
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';


const Case = () => {
    const params = useParams();
    const case_id = params.case_id;
    return (
    <div>
        <Container className='mt-3 mb-3' fluid>
        <Row>
            <Col lg={3}>
                <DataList case_id={case_id}/>
            </Col>
            <Col lg={6}>
                <RelationGraph/>
            </Col>
            <Col lg={3}>
                <Tools/>
            </Col>
        </Row>
        <Row>
            <Col lg={9}>
                <Timeline/>
            </Col>
            <Col lg={3}>
                <ProgressPanel/>
            </Col>
        </Row>
        </Container>
        
        
    </div>
    )
}

export default Case