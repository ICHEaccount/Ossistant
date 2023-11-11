import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
import cls from 'classnames'

const RunCard = (props) => {
	const list = props.runList?[...props.runList].reverse():null
	const status = props.status
    const [selectedEventKey, setSelectedEventKey] = useState('list');
	const [selectedRun, setselectedRun] = useState({})

	// console.log(list,status);

	const runList = list?.map((run)=>{
		console.log(run);
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
    {selectedEventKey==="list"?(list?runList:<p className='tw-text-center'>no run yet</p>):(
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
					return null
				}
				if(key==="tool_id") return null
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
			{selectedRun.results.length!==0?<p className='tw-text-center tw-text-lg'>Result</p>:null}
			{
				selectedRun.results?.map((result)=>{
					return (selectedRun.results.map((result)=>{
						const type = Object.keys(result.result)[0]
						return (
						<InputGroup className='mb-1 px-1'>
						{/* {type==="error"?null:<InputGroup.Checkbox aria-label="Checkbox for following text input" />} */}
						<InputGroup.Text className={cls('',{'tw-text-red-500':type==="error"})} >{type}</InputGroup.Text>
						<Form.Control
						placeholder={result.result[type]}
						disabled
						/>
						</InputGroup>)
					}))
				})
			}
			{/* {selectedRun.results.length!==0&&status!=="error"?<Col md={{ span: 3, offset: 9 }}><Button type="submit" variant="outline-primary" >{"Add"}</Button></Col>:null} */}
        </Form>
	</Card>
	)}
    </Container>
	)	
}

export default RunCard