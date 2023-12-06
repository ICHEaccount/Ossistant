import React, { useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, InputGroup, Overlay, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
import cls from 'classnames'
import { useSelector, useDispatch } from 'react-redux';
import {changeRunView,changeResultView, changeBehavior} from '../../reducers/node'
import Axios from 'axios'


const RunCard = (props) => {
	const list = props.runList?[...props.runList].reverse():null
	const status = props.status
	const case_id = props.case_id
	const dispatch = useDispatch()
    // const [selectedEventKey, setSelectedEventKey] = useState('list');
	const selectedEventKey = useSelector(state=>state.node.runView)
	// const [selectedRun, setselectedRun] 
	const selectedRun = useSelector(state=>state.node.result)
	const [selectedResults, setselectedResults] = useState([])
    const [show, setshow] = useState(false)
	const addButton = useRef()
	// console.log(list,status);

	const addNode = (e) =>{
		e.preventDefault()

		if (selectedResults.length === 0) {
            setshow(!show)
            return;
        }
		const payload = {
			case_id:case_id,
			tool_id:selectedRun.tool_id,
			input_node:selectedRun.input_node,
			result_id: selectedResults
		}
		console.log(payload);
		Axios.post('/tools/createResultNode',payload)
		.then((res)=>{
			console.log(res);
			dispatch(changeBehavior("add result"))
			console.log("changed");
			// console.log(changeSelectedRun);
			// dispatch(changeResultView({result:changeSelectedRun,status}))
			dispatch(changeRunView('list'))
			setselectedResults([])
			// window.location.reload();
		})
		.catch((err)=>{
			console.log(err);
		})

		console.log(selectedResults);
	}

	const handleValue = (value) =>{
		// console.log(value);
		if(selectedResults.indexOf(value)!==-1){
			setselectedResults((prev)=>prev.filter((item)=>{return item!==value}))
		}else{
			setselectedResults([...selectedResults,value])
		}
	}

	const runList = list?.map((run)=>{
		// console.log(run);
		return(<Card className="mt-1" key={run.run_id}>
		<Card.Body>
			<Row>
				<Col xs="10"><strong>{run.tool_name}</strong> <small>{run.runtime}</small></Col>
				<Col xs="2" className="d-flex align-items-center">
					<ChevronRight className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-white' size={20} onClick={()=>{dispatch(changeRunView("details"));dispatch(changeResultView({result:run,status}))}}/>
				</Col>
			</Row>
		</Card.Body>
	</Card>)
	})

	return (
	<Container>
    {selectedEventKey==="list"?(list?runList:<p className='tw-text-center'>no run yet</p>):(
		<Card className='mt-1'>
		<Card.Header className='mb-1 tw-bg-bright-peach'>
			<ChevronLeft className='tw-mr-2 hover:tw-cursor-pointer tw-inline hover:tw-border hover:tw-border-bright-peach' size={20} onClick={()=>{dispatch(changeRunView('list'));setselectedResults([])}}/>	
			{selectedRun.tool_name}

		</Card.Header>
		<Form onSubmit={addNode}>
            {Object.keys(selectedRun).map((key) => {
				if(key==="results"){
					return null
				}
				if(key==="tool_id") return null
				if(key==="input_node") return null
				if(key==="run_id") return null

                return(
                    <InputGroup className='mb-1 px-1'>
                    <InputGroup.Text >{key}</InputGroup.Text>
                    <Form.Control
                    placeholder={selectedRun[key]}
                    disabled
                    />
                    </InputGroup>
                )                         
            }
            )}
			{selectedRun.results.length!==0?<p className='tw-text-center tw-text-lg'>{status==="error"?"Error":"Result"}</p>:null}
			{
				selectedRun.results?.map((result,idx)=>{
					// console.log(result);
					const type = result.result.type
					if(result.result.value===null | result.result.value==="") return null
					return (
					<InputGroup className='mb-1 px-1'>
					{status==="error"?null:<InputGroup.Checkbox disabled={result.created} checked={result.created?true:selectedResults.indexOf(result.result_id)!==-1} onChange={(e)=>handleValue(result.result_id)}/>}
					<InputGroup.Text className={cls('',{'tw-text-red-500':status==="error"})} >{type}</InputGroup.Text>
					<OverlayTrigger placement="right" overlay={<Tooltip id={idx}>{result.result.value}</Tooltip>}>
					<Form.Control
					placeholder={result.result.value}
					as={status==="error"?"textarea":"input"}
					disabled
					className='tw-inline'
					/>
					</OverlayTrigger>

					</InputGroup>)
				})
			}
			
			{selectedRun.results.length!==0&&status!=="error"?
			<Col md={{ span: 2, offset: 9 }}>
				<div ref={addButton}>
					<Button  type="submit" variant="disable" className='mb-2 mt-1 tw-bg-bright-peach hover:tw-bg-peach hover:tw-text-bright-peach tw-border-0 tw-text-peach'>{"Add"}</Button>
					{selectedResults.length === 0?(<Overlay target={addButton.current} show={show} placement="right">
					{(props) => (
						<Tooltip id="overlay-example" {...props}>
						No items selected
					</Tooltip>
					)}
					</Overlay>):null}
						</div>
				
			</Col>:null}
        </Form>
	</Card>
	)}
    </Container>
	)	
}

export default RunCard