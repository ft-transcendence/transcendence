import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const handleSubmit = (event: any) => {

  event.preventDefault();

};

// Enable 2FA modal

export function Activate2FA(props: any) {

  const [image, setImage] = useState<string>("");

  useEffect(() => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("userToken"));
    fetch("http://localhost:4000/auth/2fa/generate", {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => setImage(data))
  }, []);

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
        {image?
        <div className="profile-pic-inside">
          <img src={image} alt="2FA" />
        </div>
    : <div>Loading...</div>}
      <Form.Group className="mb-3" controlId="formbasicString">
        <Form.Label> Enter Code </Form.Label>
        <Form.Control type="email" placeholder="6-digit-code" />
        <Form.Text className="text-muted">
          Enter code from your authenticator app.
        </Form.Text>
      </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button variant="primary" type="submit"
        onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
