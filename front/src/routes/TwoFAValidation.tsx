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
    <div>
      <Form.Group className="mb-3">
        <Form.Label className="IBM-text" style={{ fontSize: "20px" }}>
          Enter your 2FA code
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="6-digit-code"
          onChange={handleInputChange}
          value={twoFACode}
          name="twoFAcode"
        />
        <Button
          variant="primary"
          type="submit"
          className="submit-button"
          size="sm"
          onClick={(e: any) => {
            handleSubmit(e);
          }}
        >
          Submit
        </Button>
      </Form.Group>
    </div>
  );
}
