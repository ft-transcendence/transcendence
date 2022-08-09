import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../globals/contexts";
import { twoFAAuth } from "../queries/twoFAQueries";

export default function TwoFAValidation() {
  let location = useLocation();
  let navigate = useNavigate();
  let auth = useAuth();

  const [twoFACode, setCode] = useState("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCode(value);
  };

  const userSignIn = useCallback(() => {
    let tmpUsername = localStorage.getItem("tmpUsername");
    console.log("userSignIn tmpUsername: ", tmpUsername);
    if (tmpUsername !== "undefined")
      auth.signin(tmpUsername, () => {
        navigate("/app/private-profile", { replace: true });
        console.log("user is signed in");
      });
    else {
      console.log("user is not authorized");
    }
  }, [navigate, auth]);

  // get username from redirect URL
  useEffect(() => {
    const username = location.search.split("=")[1];
    if (username) {
      console.log("URL username: ", username);
      localStorage.setItem("tmpUsername", username);
      navigate("/2FA");
    }
  }, [location.search, navigate]);



  const handleSubmit = (e: any) => {
    e.preventDefault();
    const tmpUsername = localStorage.getItem("tmpUsername");
    if (tmpUsername !== "undefined" && tmpUsername) {
      const twoFAValid = async (username: string) => {
        return await twoFAAuth(twoFACode, username, userSignIn);
      };
      twoFAValid(tmpUsername);
      // remove temp email from local storage
      //localStorage.removeItem("tmpUsername");
    }
    else
      console.log("username is undefined");
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
