import React,{useState,useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import { useLocation} from 'react-router-dom';
import logo from '../images/logo.png';
import { List ,QuestionCircle} from 'react-bootstrap-icons';
import Axios from "axios";

const Toolbar = () => {
    const location = useLocation();
    const [case_id, setcase_id] = useState(null)
    const [case_name, setcase_name] = useState("")
    const [case_number, setcase_number] = useState("")
    const [investigator, setinvestigator] = useState("")
    const [cases, setcases] = useState([])
    const [isload, setisload] = useState(false)

    useEffect(() => {
        const { pathname } = location;
        if (pathname.startsWith('/case/')) {
            const newCaseId = pathname.replace('/case/', '');
            setcase_id(newCaseId)
        }
        if(case_id){
            Axios.get(`/case/getCaseInfo/${case_id}`)
            .then((res)=>{
            if(res.data){
                setcase_number(res.data.case_number)
                setcase_name(res.data.case_number)
                setinvestigator(res.data.investigator)
                console.log(res.data);
            }else{
                alert('Backend Connection Failed')
            }
            })
            Axios.get("/case/getCaseList")
            .then((res)=>{
            if(res.data){
                setcases(res.data)
                setisload(true)
                console.log(res.data);
            }else{
                alert('Backend Connection Failed')
            }
            })
        }

        
        
    }, [location,case_id])
    
    const caseList = cases.map((caseData,idx)=>{
        return (<NavDropdown.Item href={`/case/${caseData.case_id}`}>{caseData.case_name}</NavDropdown.Item>)
    })
    

    return (
    <Navbar expand="lg" className="tw-bg-white">
        <Container>
        <Navbar.Brand href="/" className='tw-font-bold'>
            <img
                alt=""
                src={logo}
                className="d-inline-block tw-rounded-md tw-object-fill  tw-h-14 tw-w-20 tw-shadow-lg"
            />{' '}
            OSSISTANT
        </Navbar.Brand>
        <Navbar.Toggle/>
        <Navbar.Text>{`${case_number} ${case_name} ${investigator}`}</Navbar.Text>
        <Navbar.Collapse className="justify-content-end">
            <QuestionCircle className='tw-inline-block tw-text-3xl tw-rounded-full m-2 tw-bg-black tw-text-white'/>
            <NavDropdown id="basic-nav-dropdown" menuVariant="light" title={<List className='tw-inline-block tw-text-3xl tw-rounded-md tw-bg-black tw-text-white'/>}>

                {case_id?(<Dropdown.Item href="#action/3.1">Edit Case</Dropdown.Item>):(<NavDropdown.Item href="/">Create Case</NavDropdown.Item>)}
                <NavDropdown.Divider />
                {isload?(caseList):<NavDropdown.ItemText>No Case</NavDropdown.ItemText>}
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                About
                </NavDropdown.Item>
            </NavDropdown>
            
        </Navbar.Collapse>

        </Container>
    </Navbar>
    );
}


export default Toolbar