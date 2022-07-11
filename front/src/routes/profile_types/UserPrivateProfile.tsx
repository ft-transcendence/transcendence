import { Button, Card, Col, Container, Row } from "react-bootstrap";

export default function UserPrivateProfile() {
    return (
      <main>
        <h1 className="app-title">My account</h1>
        <Container className= "p-5 border h-100">
          <span className="profile-pic-round"></span>
          <span className="profile-username-text">@Looloose</span>
        </Container>
        {/* <Container>
          <Row flex>
            <Col>
              <Card className="profile-card">
                <Card.Body>
                    <div>
                      <Row>
                        <Col>
                          <span className="Auth-form-title" style={{fontSize: "15px"}}> USERNAME </span>
                          <span className="form-test" style={{fontSize: "12px"}}>Looloose</span>
                        </Col>
                        <Col></Col>
                        <Col className="text-right">
                          <Button variant="secondary" className="submit-button float-end" size="sm">Edit</Button>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row>
                        <Col>
                          <span className="Auth-form-title"> EMAIL </span>
                          <span className="form-test" style={{fontSize: "12px"}}>mvaldes@student.42.fr</span>
                        </Col>
                        <Col></Col>
                        <Col>
                          <Button variant="secondary" className="submit-button float-end" size="sm">Edit</Button>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row>
                        <Col>
                          <span className="Auth-form-title" style={{fontSize: "15px"}}> PHONE NUMBER </span>
                          <span className="form-test" style={{fontSize: "12px"}}>******7535</span>
                        </Col>
                        <Col>
                          <Button variant="secondary" className="submit-button float-end" size="sm">Remove</Button>
                        </Col>
                        <Col>
                          <Button variant="secondary" className="submit-button float-end" size="sm">Edit</Button>
                        </Col>
                      </Row>
                    </div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
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
        </Container> */}
      </main>
    );
  }