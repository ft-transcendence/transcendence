import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { twoFAAuth } from "../queries/twoFAQueries";

export default function TwoFAValidation() {

  let location = useLocation();
  let navigate = useNavigate();
  const [twoFACode, setCode] = useState("");
  // get username from redirect URL
  useEffect(() => {
    const email = location.search.split("=")[1];
    if (email) {
      console.log(email);
      // Store username in local storage temporarily
      localStorage.setItem("tempemail", email);
      navigate("/2FA");
    }
  }, [location.search, navigate]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCode(value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const email = localStorage.getItem("tempemail");
    console.log('2fa code', twoFACode, email);
    if (email) {
    const twoFAValid = async (email: string) => {
      return await twoFAAuth(twoFACode, email);
    };
    twoFAValid(email);
    // remove temp email from local storage
    localStorage.removeItem("tempemail");
  }
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
