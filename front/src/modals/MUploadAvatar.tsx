import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { uploadAvatarQuery } from "../queries/avatarQueries";

export function MUploadAvatar(props: any) {
  const [newAvatar, setNewAvatar] = useState<any>();

  const onChange = (e: any) => {
    setNewAvatar(e.target.files[0]);
  };

  const handleSubmit = (event: any) => {
    if (newAvatar) {
      const uploadAvatar = async () => {
        const result_1 = await uploadAvatarQuery(newAvatar);
        if (result_1 !== "error: avatar") {
          props.isAvatarUpdated();
          props.onHide();
        } else console.log("Could not post avatar.");
      };
      uploadAvatar();
    }
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
          Upload Avatar
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Choose an image to use as your avatar.</Form.Label>
          <Form.Control type="file" onChange={onChange} />
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
