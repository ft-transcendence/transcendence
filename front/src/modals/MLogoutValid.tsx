import { Modal, Button } from "react-bootstrap";

export function MLogoutValid(props: any) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Log Out</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you wish to log out ?</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={props.onHide}>
          No
        </Button>
        <Button variant="outline-success" onClick={props.onSubmit}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
