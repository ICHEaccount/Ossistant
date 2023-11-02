import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'

const RunCard = (props) => {
	const list = props.runList
    const [selectedEventKey, setSelectedEventKey] = useState('list');
	const [selectedRun, setselectedRun] = useState({})


	const runList = list?.map((run)=>{
		
		return(<Card className="mt-1" key={run.run_id}>
		<Card.Body>
			<Row>
				<Col xs="10">{`#${run.run_id} ${run.tool_name}`}</Col>
				<Col xs="2" className="d-flex align-items-center">
					<Button
						variant="outline-primary"
						size="sm"
						onClick={() => {
							setSelectedEventKey(`selected-${run.run_id}`);
							setselectedRun(run)
						}}
					>
						<ChevronRight />
					</Button>
				</Col>
			</Row>
		</Card.Body>
	</Card>)
	})

	return (
	<Container>
    {selectedEventKey==="list"?(list?runList:null):(
		<Card className='mt-1'>
		<Card.Header className='mb-1'>
			<Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setSelectedEventKey('list')}}><ChevronLeft/></Button>
			{selectedRun.tool_name}
			{/* {onEdit?
			<Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setonEdit(false)}}><Check/></Button>
			:<Button variant="light" size='sm' className='tw-mr-2' onClick={()=>{setonEdit(true)}}><PencilSquare/></Button>} */}
		</Card.Header>
		<Form>
            {Object.keys(selectedRun).map((key) => {
				if(key==="results"){
					return (selectedRun.results.map((result)=>{
						const type = Object.keys(result.result)[0]
						return (<InputGroup className='mb-1 px-1'>
                    	<InputGroup.Text >{type}</InputGroup.Text>
                    	<Form.Control
                    	placeholder={result.result[type]}
                    	disabled
                    	/>
                    	</InputGroup>)
					}))
				}
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
        </Form>
	</Card>
	)}
    </Container>
	)	
}

export default RunCard