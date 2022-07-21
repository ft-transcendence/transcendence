import { executionAsyncId } from "async_hooks";
import { useEffect, useState } from "react";
import { Col, Card, Container, Nav, Navbar } from "react-bootstrap";
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
  id: number;
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
          id: i,
          userModel: { username: "", avatar: "" },
        };
        newRow.userModel.username = fetchedFriends[i].username;
        newRow.userModel.avatar = fetchedFriends[i].avatar;
        friends.push(newRow);
      }
      setFriendsList(friends);
      console.log("friendsList", friendsList);
    };

    fetchData();
    // setFetched(true);
  }, [isFetched]);

  return (
    <div>
      <div>this is a test: </div>
      {/* <DisplayRow id={1} userModel={friends[0].userModel} /> */}
      {friends.map((h) => {
        return <DisplayRow userModel={h.userModel} id={h.id} />;
      })}
      : This is the end of test
    </div>
  );
};

export const BlockedList = () => {
  return <div>Here are my foes</div>;
};

const DisplayRow = (props: ItableRow) => {
  return (
    <main>
      <div>HELLO THERE</div>
      <div>
        username = {props.userModel.username}
        avatar = {props.userModel.avatar}
      </div>
    </main>
  );
};
