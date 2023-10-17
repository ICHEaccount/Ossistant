import React,{useState,useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import { Form, Link, useLocation} from 'react-router-dom';
import logo from '../images/logo.png';
import {List, House, PersonVcard, Calendar} from 'react-bootstrap-icons';
import Axios from "axios";
import Help from './help';
import { Col, Row } from 'react-bootstrap';


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
            
            //load recent case
            Axios.get("/case/getCaseList")
            .then((res)=>{
            if(res.data){
                setcases(res.data)
                setisload(true)
                // console.log(res.data);
            }else{
                alert('Backend Connection Failed')
            }
            })
        }

        
        
    }, [location,case_id,isCasePage])
    
    //add only 3 recent case to the list
    const caseList = cases.slice(0, 3).map((caseData,idx)=>{
        return (<NavDropdown.Item href={`/casepage/${caseData.case_id}`}>{caseData.case_name}</NavDropdown.Item>)
    })


    return (
    <Navbar expand="lg" className="tw-bg-white justify-content-between">
        <Container>
        <Navbar.Brand href="/" className='tw-font-bold'>
            <img
                alt=""
                src={logo}
                className="d-inline-block tw-rounded-md tw-object-fill  tw-h-14 tw-w-20 tw-shadow-lg"
            />{' '}
            OSSISTANT
        </Navbar.Brand>
        
        <div className="ml-auto d-flex" >
            {isCasePage &&
            (<Link to="/">
                <House className='tw-inline-block tw-text-3xl tw-rounded-md tw-bg-black tw-text-white tw-mr-2' />
            </Link>)}
            <Help location = {location.pathname}/>
            <NavDropdown id="basic-nav-dropdown" menuVariant="light" title={<List className='tw-inline-block tw-text-3xl tw-rounded-md tw-bg-black tw-text-white tw-ml-2' />} >
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
                ):(<NavDropdown.Item href="/">Create Case</NavDropdown.Item>)}
                <NavDropdown.Divider />
                {isload?(caseList):<NavDropdown.ItemText>No Case</NavDropdown.ItemText>}
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                About
                </NavDropdown.Item>
            </NavDropdown>
            
        </div>

        </Container>
    </Navbar>
    );
}


export default Toolbar