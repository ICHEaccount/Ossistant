import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { ClipboardCheck, Envelope } from 'react-bootstrap-icons'


const Test = () => {
    const [korean, setkorean] = useState(false);


    return (
        <Container className='mt-2'>
            <Row className='justify-content-center'>
                <Col lg={10}>
                <Card className='tw-w-full tw-h-full mt-2'>
                    <Card.Body>
                    <Card.Title className='tw-text-center'>OSSISTANT Beta Test</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted tw-text-end">Team ICHE</Card.Subtitle>
                    <Form className='tw-flex tw-justify-end'>
                        English
                        <Form.Check className='tw-ml-2' type='switch' label="한국어" defaultChecked={korean} onChange={()=>{setkorean(!korean)}}/>

                    </Form>
                    {korean?(<Card.Text>
                        <p>테스트 대상: 전/현직 사이버 수사관 </p>
                        <p>테스트 기간: 2023-11-15 ~ 2023-11-21</p>
                    </Card.Text>)
                    :(<Card.Text>
                        <p>Tester: Former and Current Cybercrime Investigators </p>
                        <p>Period: 2023-11-15 ~ 2023-11-21</p>
                    </Card.Text>)}
                    </Card.Body>
                    <Card.Body>
                    {korean?(<Card.Text>
                        안녕하십니까, 저희는 한국정보기술연구원(KITRI) 산하 차세대 보안 리더 양성 프로그램 <a href='https://www.kitribob.kr/' rel='noreferrer' target='_blank' className='tw-underline tw-text-blue-500'>BoB</a>에서 <strong>'사이버 프로파일링을 위한 OSINT 도구 개발'</strong>을 주제로 프로젝트를 진행 중인 이체계좌팀입니다.
                        편리하고 효율적인 도구 개발을 목표로... 사이버 수사관을 대상으로 베타 테스트를 실시하고자 합니다.
                    </Card.Text>)
                    :(<Card.Text>
                    Hello, we are a team conducting a project on <strong>'Developing OSINT Tool for Criminal Profiling'</strong> as part of the Korean cyber security leadership program, <a href='https://www.kitribob.kr/' rel='noreferrer' className='tw-underline tw-text-blue-500' target='_blank'>BoB</a>.
                    </Card.Text>)}
                    </Card.Body>
                    <Card.Body>
                    {korean?(<Card.Text>
                        OSSISTANT는 ... 이러이러한 도구이고, 특징은 어쩌구 저쩌구이고 아래 구글 폼을 참고하여 테스트에 참여해주시면 감사하겠습니다. 자세한 사용설명서는 구글 폼에 첨부되어 있으니 참고바랍니다.
                    </Card.Text>)
                    
                    :(<Card.Text>
                        OSSISTANT is a user-friendly OSINT tool which contains browser extension to assist with evidence collection from web pages and web dashboard to visualize collected information, and run automated OSINT tool execution.
                    </Card.Text>)}
                    </Card.Body>
                    <Card.Body>
                    <Card.Text>
                    <h4>Contact </h4> 
                    <Card.Link href="#" rel='noreferrer' target='_blank' className='tw-underline tw-text-blue-500'> <ClipboardCheck size={12} className='tw-inline-block tw-mr-1'/>{korean?"테스트 평가 구글 폼":"Evaluation Google Form"}</Card.Link>
                    <Card.Link href="mailto:iche230905@gmail.com" className='tw-underline tw-text-blue-500'><Envelope size={12} className='tw-inline-block tw-mr-1'/>iche230905@gmail.com </Card.Link>
                    </Card.Text>
                    </Card.Body>
                    <Card.Body className='tw-flex tw-justify-center'>
                    <Button variant="primary" href='/main'>{korean?"테스트 시작":"Start"}</Button>
                    </Card.Body>
                </Card>

                </Col>
            </Row>
        </Container>
    
    )
}

export default Test