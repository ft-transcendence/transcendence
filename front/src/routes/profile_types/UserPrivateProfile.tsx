import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const ModifyUsername = (props:any) => {
  return (
    <Col className="p-3 col-6">
      <Card className="p-5 modify-card">
        <Card.Body>
          <div>
            <form>
              <div className="">
                <Form.Group className="mb-3">
                  <Form.Label className="IBM-text" style={{ fontSize: "20px" }}>
                    {props.toEdit}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={localStorage.getItem("userName")!}
                  />
                </Form.Group>
                <Form.Group className=" mb-3">
                  <Form.Label className="IBM-text" style={{ fontSize: "20px" }}>
                    CURRENT PASSWORD
                  </Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Row>
                  <Col></Col>
                  <Col>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm float-end"
                      onClick={props.onClick}
                    >
                      Cancel
                    </button>
                  </Col>
                  <Col>
                    <Button
                      variant="primary"
                      type="button"
                      className="submit-button float-end"
                      size="sm"
                    >
                      Done
                    </Button>
                  </Col>
                </Row>
              </div>
            </form>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default function UserPrivateProfile() {
  const [showUsername, setShowUsername] = useState(false);
  const onClickEditUsername = () => setShowUsername(curent => !curent);

  return (
    <main>
      <h1 className="app-title">My account</h1>
      <Container className="p-5  h-100 wrapper">
        <Row className="">
          <Col className="">
            <div className="profile-pic-round"></div>
          </Col>
          <Col className=" content">
            <div className="profile-username-text">@Looloose</div>
            <div className="caption"> See Public Profile</div>
          </Col>
        </Row>
      </Container>

      <Container className="p-5">
        <Row flex className="p-4">
          <Col className="p-3 col-6">
            <Card className="p-5 profile-card">
              <Card.Body>
                <div>
                  <Row className="wrapper p-3">
                    <Col className="text-wrapper">
                      <div className="IBM-text" style={{ fontSize: "20px" }}>
                        {" "}
                        USERNAME{" "}
                      </div>
                      <div className="ROBOTO-text" style={{ fontSize: "15px" }}>
                        Looloose
                      </div>
                    </Col>
                    <Col className=" text-right">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                        onClick={onClickEditUsername}
                      >
                        Edit
                      </button>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row className="wrapper p-3">
                    <Col className="text-wrapper">
                      <div className="IBM-text" style={{ fontSize: "20px" }}>
                        {" "}
                        EMAIL{" "}
                      </div>
                      <div className="ROBOTO-text" style={{ fontSize: "15px" }}>
                        mvaldes@student.42.fr
                      </div>
                    </Col>
                    <Col className=" text-right">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                      >
                        Edit
                      </button>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row className="wrapper p-3">
                    <Col className="text-wrapper">
                      <div className="IBM-text" style={{ fontSize: "20px" }}>
                        {" "}
                        PHONE{" "}
                      </div>
                      <div className="ROBOTO-text" style={{ fontSize: "15px" }}>
                        ******7535
                      </div>
                    </Col>
                    <Col>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                      >
                        Remove
                      </button>
                    </Col>
                    <Col>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                      >
                        Edit
                      </button>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row className="wrapper p-3">
                    <button
                      type="button"
                      className="col-5 btn btn-outline-primary btn-sm"
                    >
                      Change Password
                    </button>
                  </Row>
                </div>
                <div>
                  <Row className="wrapper p-3">
                    <Col className="text-wrapper col-8">
                      <div className="IBM-text" style={{ fontSize: "15px" }}>
                        {" "}
                        Two Factor authentifcation enabled{" "}
                      </div>
                    </Col>
                    <Col>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                      >
                        Remove 2FA
                      </button>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
          {showUsername ? <ModifyUsername toEdit="USERNAME" onClick={onClickEditUsername}/> : null}
        </Row>
      </Container>
    </main>
  );
}
