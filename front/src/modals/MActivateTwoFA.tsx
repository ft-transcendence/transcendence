import { Modal, Button, Form } from "react-bootstrap";

const handleSubmit = (event: any) => {

  event.preventDefault();

};

// Enable 2FA modal

export function Activate2FA(props: any) {
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
