import { Outlet } from "react-router-dom";
import { CNavBar } from "../Components/Navbar";
import { CProfileIcon } from "../Components/Profile";
import "../App.css";
import { Col, Row } from "react-bootstrap";

export default function UserInterface() {
  return (
    <main className="Home">
      <Row className="border">
        <Col className="border col-1">
          <CNavBar />
        </Col>
        <Col className="border p-4">
          <Outlet />
        </Col>
        <Col className="border col-1">
          <CProfileIcon />
        </Col>
      </Row>
    </main>
  );
}
