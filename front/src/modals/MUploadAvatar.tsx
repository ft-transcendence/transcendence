import { Modal, Button, Form } from "react-bootstrap";

export function MUploadAvatar(props: any) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload Avatar
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Choose an image to use as your avatar.</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
