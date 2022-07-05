import React, { useContext, useState } from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Outlet } from "react-router-dom";
import { UsernameCxt } from "../App";

export const userInputsRefs: {
  username: React.RefObject<HTMLInputElement>,
  email: React.RefObject<HTMLInputElement>,
  password: React.RefObject<HTMLInputElement>
} = {
  username: React.createRef(),
  email: React.createRef(),
  password: React.createRef(),
};

const signUp = () => {
  let userInfo: {username:string, email:string, password:string} = {
    username: userInputsRefs!.username!.current!.value,
    email: userInputsRefs!.email!.current!.value,
    password: userInputsRefs!.password!.current!.value
  }
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  let raw = JSON.stringify({
    "email": userInfo.email,
    "password": userInfo.password,
    "username": userInfo.username
  });

  fetch("http://localhost:4000/auth/signup", {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  })
    .then(response => response.text())
    .then(result => storeUserInfo(userInfo, result))
    .then(test => console.log('SIGNUP'))
    .then(test => console.log('UserToken: '+ localStorage.getItem('UserToken')) )
    .catch(error => console.log('error', error));
}

const storeUserInfo = (userInfo: any, token:any) => {
  localStorage.setItem('userToken', token);
  localStorage.setItem('userName', userInfo.username);
  localStorage.setItem('userEmail', userInfo.email);
  localStorage.setItem('userPassword', userInfo.password);
}

const handleSubmit = (event:any) => {
  event.preventDefault();
  if (userInputsRefs.username.current?.value
    && userInputsRefs.email.current?.value
    && userInputsRefs.password.current?.value)
    signUp();
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

