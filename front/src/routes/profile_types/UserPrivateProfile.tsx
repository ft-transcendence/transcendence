import { Button, Card, Col, Container, Row } from "react-bootstrap";

export default function UserPrivateProfile() {
    return (
      <main>
        <h1 className="app-title">My account</h1>
        <Container className= "p-5 border h-100 wrapper">
          <Row className="border wrapper">
            <Col className="border">
              <div className="profile-pic-round"></div>
            </Col>
            <Col className="border content">
              <div className="profile-username-text">@Looloose</div>
              <div className="caption"> See Public Profile</div>
            </Col>
          </Row>
        </Container>
        <Container className="p-5 border">
          <Row flex className="p-4 border">
            <Col className="p-3 border">
              <Card className="profile-card">
                <Card.Body>
                    <div>
                      <Row className="wrapper p-3">
                        <Col className="text-wrapper">
                          <div className="IBM-text" style={{fontSize: "20px"}}> USERNAME </div>
                          <div className="ROBOTO-text" style={{fontSize: "15px"}}>Looloose</div>
                        </Col>
                        <Col className=" text-right">
                          <Button variant="secondary" className=" submit-button float-end" size="sm">Edit</Button>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row className="wrapper p-3">
                        <Col className="text-wrapper">
                          <div className="IBM-text" style={{fontSize: "20px"}}> EMAIL </div>
                          <div className="ROBOTO-text" style={{fontSize: "15px"}}>mvaldes@student.42.fr</div>
                        </Col>
                        <Col className=" text-right">
                          <Button variant="secondary" className=" submit-button float-end" size="sm">Edit</Button>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row className="wrapper p-3">
                        <Col className="text-wrapper">
                          <div className="IBM-text" style={{fontSize: "20px"}}> PHONE </div>
                          <div className="ROBOTO-text" style={{fontSize: "15px"}}>******7535</div>
                        </Col>
                        <Col>
                          <Button variant="secondary" className=" submit-button float-end" size="sm">Remove</Button>
                        </Col>
                        <Col>
                          <Button variant="secondary" className=" submit-button float-end" size="sm">Edit</Button>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row className="wrapper p-3"> 
                      <button type="button" className="col-5 btn btn-outline-primary btn-sm">Change Password</button>
                      </Row>
                    </div>
                    <div>
                      <Row className="wrapper p-3"> 
                        <Col className="text-wrapper col-8">
                          <div className="IBM-text" style={{fontSize: "15px"}}> Two Factor authentifcation enabled </div>
                        </Col>
                        <Col>
                          <Button variant="secondary" className=" submit-button float-end" size="sm">Remove 2FA</Button>
                        </Col>
                      </Row>
                    </div>
                </Card.Body>
              </Card>
            </Col>
            <Col className="p-3">
              <Card className="Auth-form">
                <Card.Body>
                  <Card.Title className="Auth-form-title">Card title</Card.Title>
                  <Card.Text>
                    This is a longer card with supporting text below as a natural
                    lead-in to additional content. This content is a little bit longer.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }