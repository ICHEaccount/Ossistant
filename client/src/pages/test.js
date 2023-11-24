import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { ClipboardCheck, Envelope, Telegram } from 'react-bootstrap-icons'
import bob from '../images/bob_logo.jpg'
import logo from '../images/logo.png'


const Test = () => {
    const [korean, setkorean] = useState(false);


    return (
        <Container className='mt-2'>
            <Row className='justify-content-center'>
                <Col lg={10}>
                <Card className='tw-w-full tw-h-full mt-2'>
                    <Card.Body>
                    <Card.Title className='tw-text-center'>
                    <strong>OSSISTANT</strong> Beta Test
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted tw-text-end">Team ICHE</Card.Subtitle>
                    <Form className='tw-flex tw-justify-end'>
                        English
                        <Form.Check className='tw-ml-2' type='switch' label="한국어" defaultChecked={korean} onChange={()=>{setkorean(!korean)}}/>
                    </Form>
                    {korean?(<Card.Text>
                        <p>테스트 대상: 전/현직 사이버 수사관 </p>
                        <p>테스트 기간: 2023-11-22 ~ 2023-11-27</p>
                    </Card.Text>)
                    :(<Card.Text>
                        <p>Tester: Former and Current Cybercrime Investigators </p>
                        <p>Period: 22-11-2023 ~ 27-11-2023</p>
                    </Card.Text>)}
                    </Card.Body>
                    <Card.Body>
                    {korean?(<Card.Text>
                        안녕하십니까, 먼저 OSSISTANT의 베타 테스트에 참여해 주셔서 감사드립니다. <br/> 저희는 한국정보기술연구원(KITRI) 산하 차세대 보안 리더 양성 프로그램 <a href='https://www.kitribob.kr/' rel='noreferrer' target='_blank' className='tw-underline tw-text-blue-600'>BoB</a>에서 <strong>'사이버 프로파일링을 위한 OSINT 도구 개발'</strong>을 주제로 프로젝트를 진행 중인 이체계좌팀입니다.
                        저희가 개발한 도구 OSSISTANT의 사용성을 검증하고 실사용자의 피드백을 반영하기 위하여 사이버 수사관 대상 베타 테스트를 진행하고자합니다.
                    </Card.Text>)
                    :(<Card.Text>
                        Thank you for participating in OSSISTANT's beta test.<br/>
                        We are team 'ICHE', working on a project under the theme of <strong>'Developing OSINT Tools for Cyber Profiling'</strong> at the <a href='https://www.kitribob.kr/' rel='noreferrer' className='tw-underline tw-text-blue-600' target='_blank'>'Best of the Best'</a>, a next-generation security leader training program under the Korea Information Technology Research Institute (KITRI). We would like to conduct a beta test for cyber investigators to verify the usability of OSSISTANT, a tool we developed, and to reflect feedback from real users.
                    </Card.Text>)}
                    </Card.Body>
                    <Card.Body>
                    {korean?(<Card.Text>
                        OSSISTANT는 <a href='https://ko.wikipedia.org/wiki/%EA%B3%B5%EA%B0%9C%EC%B6%9C%EC%B2%98%EC%A0%95%EB%B3%B4' rel='noreferrer' target='_blank' className='tw-underline tw-text-blue-600'>OSINT(공개 정보 출처)</a>와 assistant(조수)의 합성어로, 수사관의 사이버 수사를 돕는 것을 목표로 한 OSINT 도구입니다.  OSSISTANT는 사이버 프로파일링에 특화되어 있습니다. 크롬 브라우저의 확장 프로그램과 도커 기반의 웹 대시보드로 구성되어 웹 브라우저 상에서 수사관의 OSINT 수사를 보조합니다. 수집한 정보를 OSSISTANT 웹 페이지에서 관리하고 관계망, 타임라인 그래프로 시각화 할 수 있습니다. 수집한 정보를 바탕으로 내장된 오픈 소스 OSINT 도구를 실행할 수도 있습니다.
                    </Card.Text>)
                    :(<Card.Text>
                        OSSISTANT is a combination of <a href='https://en.wikipedia.org/wiki/Open-source_intelligence' rel='noreferrer' target='_blank' className='tw-underline tw-text-blue-600'>OSINT</a> and assistant, which targets to help cybercrime investigation. OSSISTANT specializes in cyber profiling. It consists of a Chrome browser extension and a Docker-based web dashboard to assist investigators with OSINT investigations on the web browser. You can manage the collected information on the OSSISTANT webpage and visualize it as a relation and timeline graph. You can also run the built-in open-source OSINT tool based on the information you gather.
                    </Card.Text>)}
                    </Card.Body>
                    <Card.Body>
                        <Card.Text>
                        {korean?"아래 구글 폼을 참고하여 베타 테스트에 참여해주시면 감사하겠습니다.":"Please refer to the Google Form below and participate in the beta test. Your cooperation is greatly appreciated."}
                        </Card.Text>
                    </Card.Body>
                    <Card.Body  className='tw-flex tw-align-middle tw-justify-between'>
                    <Card.Text className='tw-justify-self-start'>
                    <h4>Contact </h4> 
                    <Card.Link href={korean?"https://forms.gle/rCzU8ELsexwhABaXA":"https://forms.gle/kFkvwwQ1a8hY5wNTA"} rel='noreferrer' target='_blank' className='tw-underline tw-text-blue-600'> <ClipboardCheck size={12} className='tw-inline-block tw-mr-1'/>{korean?"테스트 평가 구글 폼":"Evaluation Google Form"}</Card.Link>
                    <Card.Link href="mailto:iche230905@gmail.com" className='tw-underline tw-text-blue-600'><Envelope size={12} className='tw-inline-block tw-mr-1'/>iche230905@gmail.com </Card.Link>
                    <Card.Link href="https://t.me/+dMt5ycMlu9QzMDA1"rel='noreferrer' target='_blank' className='tw-underline tw-text-blue-600'><Telegram size={12} className='tw-inline-block tw-mr-1'/>OSSISTNAT (Telegram) </Card.Link>
                    </Card.Text>
                    <img src={bob} alt="bob_logo" className="tw-object-fill tw-justify-self-end tw-h-14 tw-w-22"/>
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