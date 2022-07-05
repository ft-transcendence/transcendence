import React, { useContext, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Outlet } from "react-router-dom";
import { UsernameCxt } from "../App";
import SignIn from "./auth_modes/SignIn";
import { useAuth } from "..";

export const userInputsRefs: {
  username: React.RefObject<HTMLInputElement>,
  email: React.RefObject<HTMLInputElement>,
  password: React.RefObject<HTMLInputElement>
} = {
  username: React.createRef(),
  email: React.createRef(),
  password: React.createRef(),
};

const signIn = (userInfo:any) => {

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  let raw = JSON.stringify({
    "email": userInfo.email,
    "password": userInfo.password,
  });

  fetch("http://localhost:4000/auth/signin", {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  })
    .then(response => response.text())
    .then(result => storeUserInfo(userInfo, result))
    .then(test => console.log('SIGNIN'))
    .then(test => console.log('userToken: '+ localStorage.getItem('userToken')) )
    .catch(error => console.log('error', error));
}

const signUp = (userInfo:any) => {

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
    .then(test => console.log('userToken: '+ localStorage.getItem('userToken')) )
    .catch(error => console.log('error', error));

}

const storeUserInfo = (userInfo: any, token:string) => {
  if (token !== "{\"statusCode\":403,\"message\":\"Credentials already exist\",\"error\":\"Forbidden\"}")
    localStorage.setItem('userToken', token);
  if (userInfo.username)
    localStorage.setItem('userName', userInfo.username);
  localStorage.setItem('userEmail', userInfo.email);
  localStorage.setItem('userPassword', userInfo.password);
}

const handleSubmit = (event:any) => {
  event.preventDefault();

  let userInfo: {username:string | null , email:string | null, password:string | null}  =
  {
    username: null,
    email: null,
    password: null
  }
  if (userInputsRefs.username.current?.value)
    userInfo.username = userInputsRefs.username.current.value;
  userInfo.email = userInputsRefs!.email!.current!.value;
  userInfo.password = userInputsRefs!.password!.current!.value;

  if (userInfo.username && userInfo.email && userInfo.password)
    signUp(userInfo);
  else
    signIn(userInfo);
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
    <LoginPage></LoginPage>
  </div>
  )
}

interface LocationState {
  from: {
    pathname: string;
  };
}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth(); // subscribe to Auth context

  const { from } = location.state as LocationState || { from: { pathname: "/" } };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username") as string;
    auth.signin(username, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name="username" type="text" />
        </label>{" "}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
