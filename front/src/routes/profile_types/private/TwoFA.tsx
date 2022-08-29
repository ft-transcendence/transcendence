import { Row, Col } from "react-bootstrap";
import { twoFAOff } from "../../../queries/twoFAQueries";

export const TwoFA = (props: any) => {
  const handleTurnOff = (e: any) => {
    e.preventDefault();
    const twoFADeactivate = async () => {
      const result = await twoFAOff();
      if (!result) {
        props.setNotifText("Cannot deactivate 2FA. Please try again.");
        props.setShowNotif(true);
      } else {
        props.setNotifText("2FA successfully deactivated.");
        props.setShowNotif(true);
        props.onDeactivate();
        localStorage.setItem("userAuth", "false");
      }
    };
    twoFADeactivate();
  };

  return (
    <div>
      <Row className="wrapper p-3">
        <Col className="text-wrapper">
          <div className="ROBOTO-text" style={{ fontSize: "15px" }}>
            <span>
              {props.auth === "true"
                ? "Two Factor authentifcation enabled"
                : "Two Factor authentifcation disabled"}
            </span>
          </div>
        </Col>
        <Col>
          <button
            type="button"
            className="btn btn-sm submit-button float-end"
            onClick={
              props.auth === "true" ? (e) => handleTurnOff(e) : props.onClick
            }
          >
            {props.auth === "true" ? "Remove 2FA" : "Activate 2FA"}
          </button>
        </Col>
      </Row>
    </div>
  );
};
