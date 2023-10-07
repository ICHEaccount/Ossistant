import React,{useState,useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import { useLocation, useParams } from 'react-router-dom';
import logo from '../images/logo.png';
import { List ,QuestionCircle} from 'react-bootstrap-icons';

const Toolbar = () => {
    const location = useLocation();
    const [case_id, setcase_id] = useState(null)

    useEffect(() => {
        const { pathname } = location;
        if (pathname.startsWith('/case/')) {
            const newCaseId = pathname.replace('/case/', '');
            setcase_id(newCaseId)
        }
        
    }, [location])
    
    

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
        <Navbar.Text>{case_id}</Navbar.Text>
        <Navbar.Collapse className="justify-content-end">
            <QuestionCircle className='tw-inline-block tw-text-3xl tw-rounded-full m-2 tw-bg-black tw-text-white'/>
            <NavDropdown id="basic-nav-dropdown" menuVariant="light" title={<List className='tw-inline-block tw-text-3xl tw-rounded-md tw-bg-black tw-text-white'/>}>

                {case_id?(<Dropdown.Item href="#action/3.1">Edit Case</Dropdown.Item>):(<NavDropdown.Item href="#action/3.1">Create Case</NavDropdown.Item>)}
                <NavDropdown.Item href="#action/3.2">
                Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
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