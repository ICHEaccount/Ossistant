import React,{useState,useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import { Form, Link, useLocation} from 'react-router-dom';
import logo from '../images/logo.png';
import {List, House, PersonVcard, Calendar, ArrowClockwise, DoorOpen} from 'react-bootstrap-icons';
import Axios from "axios";
import Help from './help';
import { Button, ButtonGroup, Col, Modal, Row } from 'react-bootstrap';


const Toolbar = () => {
    const location = useLocation();
    const [case_id, setcase_id] = useState(null)
    const [case_name, setcase_name] = useState(null)
    const [case_number, setcase_number] = useState("")
    const [investigator, setinvestigator] = useState("")
    const [created_date, setcreated_date] = useState("")
    const [cases, setcases] = useState([])
    const [isload, setisload] = useState(false)
    const [isCasePage, setisCasePage] = useState(false)
    const [show, setshow] = useState(false)

    const endTest = () =>{
        Axios.get(`/case/deleteCase/${case_id}`)
        .then((res)=>{
            console.log('res',res);
            window.location.href = "/"
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(() => {
        //check if the current location is case page
        const { pathname } = location;
        if (pathname.startsWith('/casepage/')) {
            const newCaseId = pathname.replace('/casepage/', '');
            setcase_id(newCaseId)
            setisCasePage(true)
        } else {
            setisCasePage(false)
        }
        //for the case page:
        if(isCasePage){
            if(case_id){ //load case info
                Axios.get(`/case/getCaseInfo/${case_id}`)
                .then((res)=>{
                if(res.data){
                    setcase_number(res.data.case_num)
                    setcase_name(res.data.case_name)
                    setinvestigator(res.data.investigator)
                    setcreated_date(res.data.created_date.split(':')[0])
                    
                    // console.log(res.data);
                }else{
                    alert('Backend Connection Failed')
                }
                })
            }
            

        }
        //load recent case
        Axios.get("/case/getCaseList")
        .then((res)=>{
        if(res.data){
            setcases(res.data.reverse())
            setisload(true)
            // console.log(res.data);
        }else{
            alert('Backend Connection Failed')
        }
        })
        
        
    }, [location,case_id])
    
    //add only 3 recent case to the list
    const caseList = cases.slice(0, 3).map((caseData,idx)=>{
        return (<NavDropdown.Item href={`/casepage/${caseData.case_id}`}>{caseData.case_name}</NavDropdown.Item>)
    })


    return (
    <Navbar expand="lg" className="tw-bg-gradient-to-r tw-from-navy tw-to-peach justify-content-between">
        <Container>
        <Navbar.Brand href="/main" className='tw-font-bold tw-text-white hover:tw-text-white'>
            <img
                alt=""
                src={logo}
                className="d-inline-block tw-rounded-md tw-object-fill  tw-h-14 tw-w-20 tw-shadow-lg"
            />{' '}
            OSSISTANT
        </Navbar.Brand>
        
        <div className="ml-auto d-flex" >
            {isCasePage&&(<DoorOpen className='hover:tw-cursor-pointer tw-inline-block tw-text-3xl tw-rounded-md tw-bg-dark-navy tw-text-white tw-mr-2 hover:tw-border hover:tw-border-transparent tw-p-1' onClick={()=>setshow(true)}/>)}
            {isCasePage&&(<ArrowClockwise className='hover:tw-cursor-pointer tw-inline-block tw-text-3xl tw-rounded-md tw-bg-dark-navy tw-text-white tw-mr-2 hover:tw-border hover:tw-border-transparent' onClick={()=>window.location.reload()}/>)}
            {isCasePage &&
            (<Link to="/main">
                <House className='tw-inline-block tw-text-3xl tw-rounded-md tw-bg-dark-navy tw-text-white tw-mr-2 hover:tw-border hover:tw-border-transparent' />
            </Link>
            )}
            <Help location = {location.pathname} className="hover:tw-border hover:tw-border-transparent"/>
            <NavDropdown id="basic-nav-dropdown" align="end"  menuVariant="light" title={<List className='tw-inline-block tw-text-3xl tw-rounded-md tw-bg-dark-navy tw-text-white tw-ml-2' />} >
                {case_id?(
                    <div>
                    <NavDropdown.ItemText >{case_name}</NavDropdown.ItemText>
                    <NavDropdown.ItemText >
                        <PersonVcard className='tw-m-1 tw-inline' />
                        {investigator}
                    </NavDropdown.ItemText>
                    <NavDropdown.ItemText>
                        <Calendar className='tw-m-1 tw-inline'/>
                        {created_date}
                    </NavDropdown.ItemText>
                    </div>
                ):(<NavDropdown.Item href="/main">Create Case</NavDropdown.Item>)}
                <NavDropdown.Divider />
                {isload?(caseList):<NavDropdown.ItemText>No Case</NavDropdown.ItemText>}
                <NavDropdown.Divider />
                <NavDropdown.Item href="/main">
                About
                </NavDropdown.Item>
            </NavDropdown>
            
        </div>
        <Modal show={show} onHide={()=>setshow(false)}>
        <Modal.Header closeButton>
        <Modal.Title>Finish Beta Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Delete every case data and Go back to main page
        <div className='tw-flex tw-justify-end'>
        <Button variant="disable" className='tw-mr-1 tw-bg-navy hover:tw-bg-dark-navy hover:tw-text-white tw-border-0 tw-text-white' onClick={endTest}>
            Yes
        </Button>
        <Button variant="disable" className='tw-mr-1 tw-bg-bright-peach hover:tw-bg-peach hover:tw-text-bright-peach tw-border-0 tw-text-peach' onClick={()=>setshow(false)}>
            No
        </Button>
        </div>


        </Modal.Body>
        </Modal>
        </Container>
    </Navbar>
    );
}


export default Toolbar