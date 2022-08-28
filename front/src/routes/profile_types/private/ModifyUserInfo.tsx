import { useState } from "react";
import { Col, Card, Row, Button, Form } from "react-bootstrap";
import {
  updateUsernameQuery,
  updateEmailQuery,
} from "../../../queries/updateUserQueries";
import { TAlert } from "../../../toasts/TAlert";

export const ModifyEntry = (props: any) => {
  const initialValues = {
    email: "",
    userName: "",
  };

  const [userInput, setUserInput] = useState(initialValues);
  const [showNotif, setShowNotif] = useState(false);
  const [notifText, setNotifText] = useState("Error");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (userInput.userName) {
      const updateUsername = async () => {
        const result = await updateUsernameQuery(userInput.userName);
        if (result !== "error") {
          const button = document.getElementById("handleChange");
          if (button) {
            button.setAttribute("name", "userName");
            button.setAttribute("value", userInput.userName);
            props.changeUserInfoHook(e);
            props.onClick();
          }
        } else {
          setNotifText(
            "Username already taken. Please enter another username."
          );
          setShowNotif(true);
        }
      };
      updateUsername();
    }
    if (userInput.email) {
      const updateEmail = async () => {
        const result = await updateEmailQuery(userInput.email);
        if (result !== "error") {
          const button = document.getElementById("handleChange");
          if (button) {
            button.setAttribute("name", "email");
            button.setAttribute("value", userInput.email);
            props.changeUserInfoHook(e);
            props.onClick();
          }
        } else {
          setNotifText("Email already taken. Please enter another email.");
          setShowNotif(true);
        }
      };
      updateEmail();
    }
  };
  return (
    <Col className="col-6">
      <TAlert show={showNotif} setShow={setShowNotif} text={notifText} />
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
                      id="handleChange"
                      variant="primary"
                      type="submit"
                      className="submit-button float-end"
                      size="sm"
                      onClick={(e: any) => {
                        handleSubmit(e);
                      }}
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
          type="email"
          placeholder="new email"
          onChange={props.setUserInput}
          value={props.modifyInput}
          name="email"
        />
      </Form.Group>
    </div>
  );
};
