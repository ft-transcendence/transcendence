import { Col, Card, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

export const UsersRelations = () => {
  return (
    <Col className="col-6">
      <Card className="p-5 modify-card">
        <Navbar className="IBM-text" style={{ fontSize: "15px" }} expand="lg">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="">
                <NavLink
                  to="/app/private-profile/friends"
                  className={({ isActive }) =>
                    isActive ? "active-class" : "not-active-class"
                  }
                >
                  FRIENDS
                </NavLink>
                |{" "}
                <NavLink
                  to="/app/private-profile/pending"
                  className={({ isActive }) =>
                    isActive ? "active-class" : "not-active-class"
                  }
                >
                  PENDING
                </NavLink>
                |{" "}
                <NavLink
                  to="/app/private-profile/blocked"
                  className={({ isActive }) =>
                    isActive ? "active-class" : "not-active-class"
                  }
                >
                  BLOCKED
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet />
      </Card>
    </Col>
  );
};
