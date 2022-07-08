import { Button, Card, Col, Container, Row } from "react-bootstrap";

export default function UserPrivateProfile() {
    return (
      <Container>
        <Row flex>
          <Col>
            <Card className="Auth-form">
              <Card.Body>
                  <div>
                    <Row>
                      <Col>
                        <h3 className="Auth-form-title" style={{fontSize: "15px"}}> USERNAME </h3>
                        <span className="form-test" style={{fontSize: "12px"}}>Looloose</span>
                      </Col>
                      <Col></Col>
                      <Col style={{marginLeft: "auto", marginRight: "0"}}>
                        <Button variant="secondary" className="submit-button" size="sm">Edit</Button>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col>
                        <h3 className="Auth-form-title" style={{fontSize: "15px"}}> EMAIL </h3>
                        <span className="form-test" style={{fontSize: "12px"}}>mvaldes@student.42.fr</span>
                      </Col>
                      <Col></Col>
                      <Col style={{marginLeft: "auto", marginRight: "0"}}>
                        <Button variant="secondary" className="submit-button" size="sm">Edit</Button>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col>
                        <h3 className="Auth-form-title" style={{fontSize: "15px"}}> PHONE NUMBER </h3>
                        <span className="form-test" style={{fontSize: "12px"}}>******7535</span>
                      </Col>
                      <Col style={{marginLeft: "auto", marginRight: "0"}}>
                        <Button variant="secondary" className="submit-button" size="sm">Remove</Button>
                      </Col>
                      <Col>
                        <Button variant="secondary" className="submit-button" size="sm">Edit</Button>
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
      </Container>
    );
  }