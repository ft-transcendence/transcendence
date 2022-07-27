import { useState } from "react";
import { Col, Card, Row, Button, Form } from "react-bootstrap";
import {
  updateUsernameQuery,
  updateEmailQuery,
} from "../../queries/updateUserQueries";

export const ModifyEntry = (props: any) => {
  const initialValues = {
    email: "",
    userName: "",
    phone: "",
    newPass: "",
    pass: "",
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
    console.log("--------------");
    if (userInput.userName) {
      updateUsernameQuery(userInput.userName);
      const button = document.getElementById("handleChange");
      if (button) {
        button.setAttribute("name", "userName");
        button.setAttribute("value", userInput.userName);
      }
    }
    if (userInput.email) {
      updateEmailQuery(userInput.email);
      const button = document.getElementById("handleChange");
      if (button) {
        button.setAttribute("name", "email");
        button.setAttribute("value", userInput.email);
      }
    }
    // ADD THE REST WHEN BACK HAS DEDICATED FUNCTIONS FOR IT
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
                {/* <CurrentPasswordValidation
                  setUserInput={handleInputChange}
                  userInput={userInput.pass}
                /> */}
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
                        props.changeUserInfoHook(e);
                        props.onClick();
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

// const CurrentPasswordValidation = (props: any) => {
//   return (
//     <div>
//       <Form.Group className="mb-3">
//         <Form.Label className="IBM-text" style={{ fontSize: "20px" }}>
//           PASSWORD
//         </Form.Label>
//         <Form.Control
//           type="password"
//           placeholder="current password"
//           onChange={props.setUserInput}
//           value={props.modifyInput}
//           name="pass"
//         />
//       </Form.Group>
//     </div>
//   );
// };
