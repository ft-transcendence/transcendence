import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../globals/contexts";
import { twoFAAuth } from "../queries/twoFAQueries";

export default function TwoFAValidation() {
  let location = useLocation();
  let navigate = useNavigate();
  let auth = useAuth();
  let username = localStorage.getItem("userName");

  const [twoFACode, setCode] = useState("");

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    setCode(value);
  };

  // get username from redirect URL
  useEffect(() => {
    const urlUsername = location.search.split("=")[1];
    if (urlUsername) {
      localStorage.setItem("userName", urlUsername);
      navigate("/2FA");
    }
  }, [location.search, navigate]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const userSignIn = () => {
      let username = localStorage.getItem("userName");
      console.log("username: ", username);
      if (username)
        auth.signin(username, () => {
          navigate("/app/private-profile", { replace: true });
        });
      console.log("user is signed in");
    };

    if (username !== "undefined" && username) {
      const twoFAValid = async (username: string) => {
        return await twoFAAuth(twoFACode, username, userSignIn);
      };
      twoFAValid(username);
    } else console.log("username is undefined");
  };

  return (
    <div className="p-5">
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Login with 2FA.</h3>
            <div className="text-secondary">
              Open your favorite authentication app, and enter the corresponding
              code.
            </div>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="6-digit-code"
                onChange={handleInputChange}
                value={twoFACode}
                name="twoFAcode"
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="submit-button float-end"
              size="sm"
              onClick={(e: any) => {
                handleSubmit(e);
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
