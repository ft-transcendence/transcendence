import { Row, Col } from "react-bootstrap";

export const TwoFA = (props: any) => {
  return (
    <div>
      <Row className="wrapper p-3">
        <Col className="text-wrapper col-8">
          <div className="IBM-text" style={{ fontSize: "15px" }}>
            {/* FETCH THE BACK TO SEE IF 2FA IS ENABLED */}
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
            className="btn btn-secondary btn-sm submit-button float-end"
            // onClick={}
          >
            {props.auth === "true" ? "Remove 2FA" : "Activate 2FA"}
          </button>
        </Col>
      </Row>
    </div>
  );
};
