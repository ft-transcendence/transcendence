import React, { useState } from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Outlet } from "react-router-dom";

export const userInputsRefs: {
  username: React.RefObject<HTMLInputElement>,
  email: React.RefObject<HTMLInputElement>,
  password: React.RefObject<HTMLInputElement>
} = {
  username: React.createRef(),
  email: React.createRef(),
  password: React.createRef(),
};

const handleSubmit = (event:any) => {
  event.preventDefault();
  if (userInputsRefs.username.current?.value && userInputsRefs.email.current?.value && userInputsRefs.password.current?.value)
  {
    console.log('username:' + userInputsRefs.username.current?.value);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    let raw = JSON.stringify({
      "email": userInputsRefs.email.current.value,
      "password": userInputsRefs.password.current.value,
      "username": userInputsRefs.username.current.value
    });

    console.log('password: ' + userInputsRefs.password.current.value);
    
    fetch("http://localhost:4000/auth/signup", {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })
      .then(response => response.text())
      .then(result => localStorage.setItem('UserToken', result))
      .then(test => console.log('UserToken: '+ localStorage.getItem('UserToken')) )
      .catch(error => console.log('error', error));
  }
  
}

export default function Auth () {

  return (
  <div className="Auth-form-container">
    <form className="Auth-form" onSubmit={handleSubmit}>
      <div className="Auth-form-content">
        <Outlet />

        <Form.Group className="mb-3">
          <Form.Label className="form-test ">EMAIL</Form.Label>
          <Form.Control
          ref={userInputsRefs.email}
          type="email"
          placeholder="name@example.com"
          />
        </Form.Group >
        
        <Form.Group className="mb-3">
          <Form.Label className="form-test" htmlFor="inputPassword1">PASSWORD</Form.Label>
          <Form.Control
          ref={userInputsRefs.password}
            type="password"
            id="inputPassword5"
            aria-describedby="passwordHelpBlock"
            placeholder="****"
          />
          <Form.Text className="form-help-block" id="passwordHelpBlock" muted>
            Your password must be 8-20 characters long.
          </Form.Text>
        </Form.Group >

          <Button variant="secondary" className="submit-button" size="sm">Sign in with 42</Button>
          <Button variant="primary" type="submit" className="submit-button" size="sm" >
            Submit
          </Button>
        <p className="text-secondary mt-2">
          Forgot your &nbsp; <a href="#">password?</a>
        </p>
      </div>
    </form>
  </div>
  )
}

  function useHistory() {
    throw new Error("Function not implemented.");
  }

