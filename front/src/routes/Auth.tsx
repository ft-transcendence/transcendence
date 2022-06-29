import { useState } from "react"
import Form from 'react-bootstrap/Form'

export default function Auth(props:any) {
  return (AuthForm());
}

function AuthForm() {

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
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              {authMode === "signin" ? "Sign In": "Sign Up"}
            </span>
          </div>
          {authMode == "signup" &&
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
              <Form.Control
              type="text"
              placeholder="JaneDoe"
              />
            </Form.Group>
          }
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control
            type="email"
            placeholder="name@example.com"
            />
          </Form.Group>
          <Form.Label htmlFor="inputPassword5">Password</Form.Label>
          <Form.Control
            type="password"
            id="inputPassword5"
            aria-describedby="passwordHelpBlock"
            placeholder="****"
          />
          <Form.Text id="passwordHelpBlock" muted>
            Your password must be 8-20 characters long.
          </Form.Text>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  )
}