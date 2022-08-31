import { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { NotifCxt } from "../App";
import { twoFAGenerate, twoFAOn } from "../queries/twoFAQueries";

export function Activate2FA(props: any) {
  const notif = useContext(NotifCxt);
  const [image, setImage] = useState<string>("");
  const [FACodeModal, setCodeModal] = useState("");

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    setCodeModal(value);
  };

  const getQRCode = async () => {
    const result = await twoFAGenerate();
    if (!result)
      setImage(
        "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png"
      );
    else setImage(result);
  };

  useEffect(() => {
    if (props.show && image === "") getQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const twoFAActivate = async () => {
      const result = await twoFAOn(FACodeModal);
      if (!result) {
        notif?.setNotifText("Wrong code. Please try again.");
        notif?.setNotifShow(true);
      } else {
        props.onHide();
        props.onSubmit();
        localStorage.setItem("userAuth", "true");
        notif?.setNotifText(
          "TwoFA activated. A code will be asked on each login."
        );
        notif?.setNotifShow(true);
      }
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
          <div>
            <i
              id="clickableIcon"
              className="bi bi-arrow-clockwise icons thick float-end"
              onClick={(e: any) => {
                e.preventDefault();
                getQRCode();
              }}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={image} alt="2FA" />
            </div>
          </div>
        ) : (
          <Spinner animation="border" />
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
        <Button variant="outline-danger" size="sm" onClick={props.onHide}>
          Close
        </Button>
        <Button
          variant="outline-success"
          size="sm"
          onClick={(e: any) => {
            handleSubmit(e);
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
