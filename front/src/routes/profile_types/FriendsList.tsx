import { executionAsyncId } from "async_hooks";
import React from "react";
import { useEffect, useState } from "react";
import { Col, Card, Container, Nav, Navbar, Row } from "react-bootstrap";
import { Link, NavLink, Outlet } from "react-router-dom";
import { getUserFriends } from "../../queries/userQueries";

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
                </NavLink>{" "}
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

interface ItableRow {
  key: number;
  userModel: { username: string; avatar: string };
}

export const FriendsList = () => {
  const [friendsList, setFriendsList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState(false);

  let friends: ItableRow[] = [];

  useEffect(() => {
    const fetchData = async () => {
      let fetchedFriends = await getUserFriends();

      for (let i = 0; i < fetchedFriends.length; i++) {
        let newRow: ItableRow = {
          key: i,
          userModel: { username: "", avatar: "" },
        };
        newRow.userModel.username = fetchedFriends[i].username;
        newRow.userModel.avatar = fetchedFriends[i].avatar;
        friends.push(newRow);
      }
      setFriendsList(friends);
      console.log("friendsList", friendsList);
      setFetched(true);
    };

    fetchData();
  }, [isFetched]);

  return (
    <div>
      {isFetched ? (
        friendsList!.map((h, index) => {
          return <DisplayRow key={index} userModel={h.userModel} />;
        })
      ) : (
        <div>No Data available, please reload.</div>
      )}
    </div>
  );
};

export const BlockedList = () => {
  return <div>Here are my foes</div>;
};

const DisplayRow = (props: ItableRow) => {
  return (
    <main>
      <Container className="p-2">
        <Row className="" style={{ alignItems: "center", display: "flex" }}>
          <Col className="p-1 border float-end">
            <div className="profile-pic-wrapper">
              <div
                className="profile-pic-inside-sm"
                style={{
                  backgroundImage: `url("https://cdn.intra.42.fr/users/mvaldes.JPG")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
          </Col>
          <Col className=" content " style={{ paddingLeft: "0px" }}>
            <div className="profile-username-text" style={{ fontSize: "18px" }}>
              @{props.userModel.username}
            </div>
          </Col>
          <Col className="">
            <button
              type="button"
              className="IBM-text btn btn-sm"
              style={{ fontSize: "15px" }}
            >
              Remove
            </button>
          </Col>
          <Col className="">
            <button
              type="button"
              className="IBM-text btn btn-sm"
              style={{ fontSize: "15px" }}
            >
              Block
            </button>
          </Col>
        </Row>
      </Container>
    </main>
  );
};
