import { Col, Card, Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export const UsersRelations = () => {
  return (
    <Col className="col-6">
      <Card className="p-5 modify-card">
        <Navbar className="IBM-text" style={{ fontSize: "15px" }} expand="lg">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link to="/app/private-profile/friends">FRIENDS</Link> | {" "} 
                <Link to="/app/private-profile/blocked">BLOCKED</Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet />
      </Card>
    </Col>
  );
};

export const FriendsList = () => {
  return <div>COOL</div>;
};

export const BlockedList = () => {
  return <div>NOT COOL</div>;
};
