import React, { useContext, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Outlet } from "react-router-dom";
import { UsernameCxt } from "../App";
import SignIn from "./auth_modes/SignIn";
import { useAuth } from "..";
import { clear } from "console";

export const userInputsRefs: {
  username: React.RefObject<HTMLInputElement>;
  email: React.RefObject<HTMLInputElement>;
  password: React.RefObject<HTMLInputElement>;
} = {
  username: React.createRef(),
  email: React.createRef(),
  password: React.createRef(),
};

let userInfo: {
  username: string | null;
  email: string | null;
  password: string | null;
  clear: any;
} = {
  username: null,
  email: null,
  password: null,
  clear: function () {
    this.username = null;
    this.email = null;
    this.password = null;
  },
};

interface LocationState {
  from: {
    pathname: string;
  };
}

const storeUserInfo = (userInfo: any, token: string) => {
  if (
    token !==
      '{"statusCode":403,"message":"Credentials already exist","error":"Forbidden"}' &&
    token !==
      '{"statusCode":403,"message":"Invalid Credentials","error":"Forbidden"}'
  ) {
    localStorage.setItem("userToken", token);
    if (userInfo.username) localStorage.setItem("userName", userInfo.username);
    localStorage.setItem("userEmail", userInfo.email);
    localStorage.setItem("userPassword", userInfo.password);

    console.log("token: " + localStorage.getItem("userToken"));
    console.log("userEmail: " + localStorage.getItem("userEmail"));
    console.log("userPassword: " + localStorage.getItem("userPassword"));
  }
  userInfo.clear();
};

export default function Auth() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth(); // subscribe to Auth context

  function userSignIn() {
    const { from } = (location.state as LocationState) || {
      from: { pathname: "/" },
    };
    let email = localStorage.getItem("userEmail");
    if (email)
      auth.signin(email, () => {
        navigate(from, { replace: true });
      });
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (userInputsRefs.username.current?.value)
      userInfo.username = userInputsRefs.username.current.value;
    userInfo.email = userInputsRefs!.email!.current!.value;
    userInfo.password = userInputsRefs!.password!.current!.value;
    if (userInfo.username && userInfo.email && userInfo.password) signUp();
    else signIn();
  };
  
  const handleClick = (event: any) => {
    event.preventDefault();
    signIn42();
  }

  const signIn42 = () => {
    let myHeaders = new Headers();

    fetch("http://localhost:4000/auth/42", {
      method: "GET",
      headers: myHeaders,
      body: null,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      // .then((result) => storeUserInfo(userInfo, result))
      .then(() => console.log("<= SIGNIN 42"))
      // .then(() => userSignIn())
      .catch((error) => console.log("error", error));
  };

  const signIn = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      username: userInfo.email,
      password: userInfo.password,
    });

    fetch("http://localhost:4000/auth/signin", {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => storeUserInfo(userInfo, result))
      .then(() => console.log("<= SIGNIN"))
      .then(() => userSignIn())
      .catch((error) => console.log("error", error));
  };

  const signUp = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      email: userInfo.email,
      password: userInfo.password,
      username: userInfo.username,
    });

    fetch("http://localhost:4000/auth/signup", {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => storeUserInfo(userInfo, result))
      .then(() => console.log("<= SIGNUP"))
      .then(() => userSignIn())
      .catch((error) => console.log("error", error));
  };

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
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-test" htmlFor="inputPassword1">
              PASSWORD
            </Form.Label>
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
          </Form.Group>

          <Button variant="secondary" className="submit-button" size="sm" onClick={handleClick}>
            Sign in with 42
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="submit-button"
            size="sm"
          >
            Submit
          </Button>
          <p className="text-secondary mt-2">
            Forgot your &nbsp; <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  );
}
