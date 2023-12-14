import React from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'

const Privacy = () => {
  return (
    <div>
      <Container className='mt-1'>
        <Row className='justify-content-center'>
          <Col lg={10}>
            <Card className='tw-border-0 tw-w-full tw-h-full mt-2'>
              <Card.Body>
                <Card.Title className='tw-text-center'>
                <strong className='tw-bg-gradient-to-br tw-text-2xl tw-font-extrabold tw-from-navy tw-to-peach tw-inline-block tw-text-transparent tw-bg-clip-text'>개인정보처리방침</strong> 
                </Card.Title>
              </Card.Body>
              <Card.Text>
                <p><strong>1. 개인정보 수집 및 이용 목적</strong></p>
                <p>본 크롬 익스텐션은 사용자가 웹 페이지에서 가져온 정보를 기반으로 관계성을 표시하고 관리하여 수집한 내용을 한눈에 볼 수 있도록 하기 위함입니다.</p>
                <br></br>
              </Card.Text>
              <Card.Text>
                <p><strong>2. 수집하는 개인정보의 항목</strong></p>
                <p>사용자가 웹사이트에서 수집하고자 한 페이지의 URL과 텍스트 내용입니다.</p>
                <br></br>
              </Card.Text>
              <Card.Text>
                <p><strong>3. 개인정보의 보유 및 이용 기간</strong></p>
                <p>사용자가 웹페이지에서 beta test finish 버튼을 누르거나 케이스를 삭제할 때까지입니다.</p>
                <br></br>
              </Card.Text>
              <Card.Text>
                <p><strong>4. 개인정보의 제3자 제공</strong></p>
                <p>본 익스텐션은 개인정보를 제3자에게 제공하지 않습니다. 단, 베타테스트 기간 동안 다른 테스터들이 해당 내용을 볼 수 있습니다.</p>
                <br></br>
              </Card.Text>
              <Card.Text>
                <p><strong>5. 개인정보의 처리 위탁</strong></p>
                <p>개인정보의 처리 위탁은 개발자 외에 없습니다.</p>
                <br></br>
              </Card.Text>
              <Card.Text>
                <p><strong>6. 이용자의 권리와 그 행사 방법</strong></p>
                <p>이용자의 권리와 그 행사 방법에 관한 문의사항은 <Card.Link href="mailto:iche230905@gmail.com" rel='noreferrer' target='_blank' className='tw-underline tw-text-blue-600'>iche230905@gmail.com</Card.Link>으로 연락해주시기 바랍니다.</p>
                <br></br>
              </Card.Text>
            </Card>
        </Col>
        </Row>
      </Container>
       
    </div>
  )
}

export default Privacy