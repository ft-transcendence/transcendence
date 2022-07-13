import React from "react";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const CurrentPasswordValidation = (props: any) => {
  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label className="IBM-text" style={{ fontSize: "20px" }}>
          PASSWORD
        </Form.Label>
        <Form.Control
          type="password"
          placeholder="current password"
          onChange={props.setUserInput}
          value={props.modifyInput}
          name="pass"
        />
      </Form.Group>
    </div>
  );
};

const SpecificEntry = (props: any) => {
  if (props.toEdit === "EMAIL")
    return (
      <EntryIsEmail
        setUserInput={props.setUserInput}
        modifyInput={props.userInput.email}
      />
    );
    if (props.toEdit === "USERNAME")
      return (
        <EntryIsUsername
          setUserInput={props.setUserInput}
          modifyInput={props.userInput.userName}
        />
      );
  if (props.toEdit === "PHONE")
    return (
      <EntryIsPhone
        setUserInput={props.setUserInput}
        modifyInput={props.userInput.phone}
      />
    );
  if (props.toEdit === "PASSWORD")
    return (
      <EntryIsPassword
        setUserInput={props.setUserInput}
        modifyInput={props.userInput.newPass}
      />
    );
  return null;
};

const EntryIsUsername = (props: any) => {
  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label className="IBM-text" style={{ fontSize: "20px" }}>
          USERNAME
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="new username"
          onChange={props.setUserInput}
          value={props.modifyInput}
          name="userName"
        />
      </Form.Group>
    </div>
  );
};

const EntryIsEmail = (props: any) => {
  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label className="IBM-text" style={{ fontSize: "20px" }}>
          EMAIL
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="new email"
          onChange={props.setUserInput}
          value={props.modifyInput}
          name="email"
        />
      </Form.Group>
    </div>
  );
};

const EntryIsPhone = (props: any) => {
  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label className="IBM-text" style={{ fontSize: "20px" }}>
          PHONE NUMBER
        </Form.Label>
        <Form.Control
          type="tel"
          placeholder="new phone number"
          onChange={props.setUserInput}
          value={props.modifyInput}
          name="phone"
        />
      </Form.Group>
    </div>
  );
};

const EntryIsPassword = (props: any) => {
  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label className="IBM-text" style={{ fontSize: "20px" }}>
          NEW PASSWORD
        </Form.Label>
        <Form.Control
          type="password"
          placeholder="new password"
          onChange={props.setUserInput}
          value={props.modifyInput}
          name="newPass"
        />
      </Form.Group>
    </div>
  );
};

const ModifyEntry = (props: any) => {
  const initialValues = {
    email: "",
    userName: "",
    phone: "",
    newPass: "",
    pass: "",
  };

  const [userInput, setUserInput] = useState(initialValues);

  const handleSubmit = () => {
    console.log("--------------");
    console.log("userName 👉️", userInput.userName);
    console.log("email 👉️", userInput.email);
    console.log("phone 👉️", userInput.phone);
    console.log("newPass 👉️", userInput.newPass);
    console.log("password 👉️", userInput.pass);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  return (
    <Col className="p-3 col-6">
      <Card className="p-5 modify-card">
        <Card.Body>
          <div>
            <form>
              <div className="">
                <SpecificEntry
                  toEdit={props.toEdit}
                  setUserInput={handleInputChange}
                  userInput={userInput}
                />
                <CurrentPasswordValidation
                  setUserInput={handleInputChange}
                  userInput={userInput.pass}
                />
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
                      onClick={handleSubmit}
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
  const onClickEditUsername = () => setShowUsername((curent) => !curent);
  const hideUsername = () => setShowUsername(false);

  const [showEmail, setShowEmail] = useState(false);
  const onClickEditEmail = () => setShowEmail((curent) => !curent);
  const hideEmail = () => setShowEmail(false);

  const [showPhone, setShowPhone] = useState(false);
  const onClickEditPhone = () => setShowPhone((curent) => !curent);
  const hidePhone = () => setShowPhone(false);

  const [showPass, setShowPass] = useState(false);
  const onClickEditPass = () => setShowPass((curent) => !curent);
  const hidePass = () => setShowPass(false);

  return (
    <main>
      <h1 className="app-title">My account</h1>
      <Container className="p-5 h-100 wrapper">
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
                        onClick={() => {
                          onClickEditUsername();
                          hideEmail();
                          hidePhone();
                          hidePass();
                        }}
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
                        onClick={() => {
                          onClickEditEmail();
                          hideUsername();
                          hidePhone();
                          hidePass();
                        }}
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
                        onClick={() => {
                          onClickEditPhone();
                          hideUsername();
                          hideEmail();
                          hidePass();
                        }}
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
                      onClick={() => {
                        onClickEditPass();
                        hideUsername();
                        hideEmail();
                        hidePhone();
                      }}
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
          {showUsername ? (
            <ModifyEntry toEdit="USERNAME" onClick={onClickEditUsername} />
          ) : null}
          {showEmail ? (
            <ModifyEntry toEdit="EMAIL" onClick={onClickEditEmail} />
          ) : null}
          {showPhone ? (
            <ModifyEntry toEdit="PHONE" onClick={onClickEditPhone} />
          ) : null}
          {showPass ? (
            <ModifyEntry toEdit="PASSWORD" onClick={onClickEditPass} />
          ) : null}
        </Row>
      </Container>
    </main>
  );
}
