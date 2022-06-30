import { useState } from "react"
import Form from 'react-bootstrap/Form'

export default function Auth(props:any) {
  return (AuthForm());
}

const  AuthForm = () => {

  let [authMode, setAuthMode] = useState("signin")

  let changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">{authMode === "signin" ? "Sign Up": "Sign In"}</h3>
          <div className="text-center">
            Already registered?&nbsp;
            <span className="link-primary" onClick={changeAuthMode}>
              {authMode === "signin" ? "Sign in.": "Sign up."}
            </span>
          </div>

          {authMode == "signup" &&
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label className="form-test" >USERNAME</Form.Label>
              <Form.Control
              type="text"
              placeholder="JaneDoe"
              />
            </Form.Group>
          }

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
            <Form.Label className="form-test">EMAIL</Form.Label>
            <Form.Control
            type="email"
            placeholder="name@example.com"
            />
          </Form.Group >
          
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
            <Form.Label className="form-test" htmlFor="inputPassword1">PASSWORD</Form.Label>
            <Form.Control
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              placeholder="****"
            />
            <Form.Text className="form-help-block" id="passwordHelpBlock" muted>
              Your password must be 8-20 characters long.
            </Form.Text>
          </Form.Group >
          
          <div className="d-grid gap-2 mt-3">
            <button type="submit">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Forgot your &nbsp; <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  )
}