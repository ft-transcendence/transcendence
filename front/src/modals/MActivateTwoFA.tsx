import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { twoFAGenerate, twoFAValidate } from "../queries/twoFAQueries";



// Enable 2FA modal

export function Activate2FA(props: { show: boolean, onHide: () => void }) {
  const [image, setImage] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    twoFAValidate(code);
  };

  useEffect(() => {
    if (props.show && image === "") {
      const QRCode = async () => {
        return await twoFAGenerate();
      };
      QRCode()
        .then((data) => setImage(data))
        .then(() => console.log("hellow"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Scan Your QR Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {image ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={image} alt="2FA" />
          </div>
        ) : (
          <div>Loading...</div>
        )}
        <Form.Group className="mb-3" controlId="formbasicString">
          <Form.Label> Enter Code </Form.Label>
          <Form.Control type="string" onChange={(e) => { setCode(e.target.value); console.log(e.target.value)}} value={code} placeholder="6-digit-code" />
          <Form.Text className="text-muted">
            Enter code from your authenticator app.
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
