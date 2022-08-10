import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { twoFAGenerate, twoFAOn } from "../queries/twoFAQueries";

export function Activate2FA(props: any) {
  
  const [image, setImage] = useState<string>("");
  const [FACodeModal, setCodeModal] = useState("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCodeModal(value);
  };

  useEffect(() => {
    if (props.show && image === "") {
      const QRCode = async () => {
        return await twoFAGenerate();
      };
      QRCode()
        .then((data) => setImage(data))
        .then(() => console.log("QR code generated"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const twoFAActivate = async () => {
      const result = await twoFAOn(FACodeModal);
      console.log("result.statusCode: ", result.statusCode);
      if (result.statusCode !== undefined)
        console.log("error: cannot activate 2FA");
      else props.onHide();
    };
    twoFAActivate();
  };

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
          <Form.Control
            type="text"
            placeholder="6-digit-code"
            onChange={handleInputChange}
            value={FACodeModal}
            name="code"
          />
          <Form.Text className="text-muted">
            Enter code from your authenticator app.
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button
          variant="primary"
          type="submit"
          className="submit-button"
          size="sm"
          onClick={(e: any) => {
            handleSubmit(e);
            props.onSubmit();
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
