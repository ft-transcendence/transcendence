import { useContext, useState } from "react";
import { Col, Card, Row, Form } from "react-bootstrap";
import { NotifCxt } from "../../../App";
import {
  updateUsernameQuery,
  updateEmailQuery,
} from "../../../queries/updateUserQueries";

export const ModifyEntry = (props: any) => {
  const notif = useContext(NotifCxt);
  const initialValues = {
    email: "",
    userName: "",
  };

  const [userInput, setUserInput] = useState(initialValues);

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
          notif?.setNotifText(
            "Username already taken. Please enter another username."
          );
          notif?.setNotifShow(true);
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
          notif?.setNotifText(
            "Email already taken. Please enter another email."
          );
          notif?.setNotifShow(true);
        }
      };
      updateEmail();
    }
  };
  return (
    <Col className="col-6">
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
                      className="btn btn-sm submit-button float-end"
                      onClick={props.onClick}
                    >
                      Cancel
                    </button>
                  </Col>
                  <Col>
                    <button
                      id="handleChange"
                      className="btn btn-sm submit-button float-end"
                      onClick={(e: any) => {
                        handleSubmit(e);
                      }}
                    >
                      Done
                    </button>
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
