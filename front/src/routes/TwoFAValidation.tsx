import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { twoFAAuth } from "../queries/twoFAQueries";

export default function TwoFAValidation() {

  let location = useLocation();
  let navigate = useNavigate();
  const [FACode, setCode] = useState("");

  useEffect(() => {
    const email = location.search.split("=")[1];
    if (email) {
      console.log(email);
      navigate("/2FA");
    }
  }, [location.search]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCode(value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("", FACode);
    const twoFAValid = async () => {
      return await twoFAAuth(FACode, email);
    };
    twoFAValid();
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
          value={FACode}
          name="code"
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
