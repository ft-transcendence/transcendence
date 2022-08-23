import { useState, useEffect } from "react";
import { Col, Card, Container, Row } from "react-bootstrap";
import { useContextMenu } from "react-contexify";
import { ItableRow } from "../../../globals/Interfaces";
import { getUserAvatarQuery } from "../../../queries/avatarQueries";
import { getUserFriends } from "../../../queries/userFriendsQueries";

export default function DisplayUserFriends(props: any) {
  const [friendsList, setFriendsList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState("false");
  const [isUpdated, setUpdate] = useState(false);

  let friends: ItableRow[] = [];

  useEffect(() => {
    const fetchDataFriends = async () => {
      return await getUserFriends(props.userInfo.id);
    };

    const fetchDataFriendsAvatar = async (otherId: number) => {
      return await getUserAvatarQuery(otherId);
    };

    const fetchData = async () => {
      let fetchedFriends = await fetchDataFriends();

      if (fetchedFriends !== undefined && fetchedFriends.length !== 0) {
        for (let i = 0; i < fetchedFriends.length; i++) {
          let newRow: ItableRow = {
            key: i,
            userModel: { username: "", avatar: "", id: 0 },
          };

          let avatar = await fetchDataFriendsAvatar(fetchedFriends[i].id);

          newRow.userModel.id = fetchedFriends[i].id;
          newRow.userModel.username = fetchedFriends[i].username;
          if (avatar !== undefined && avatar instanceof Blob) {
            newRow.userModel.avatar = URL.createObjectURL(avatar);
          }
          friends.push(newRow);
        }
      }
      setFriendsList(friends);
      setFetched("true");
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated]);

  return (
    <main>
      <Col className="p-5">
        <Card className="p-5 main-card">
          <Card.Body>
            <Row className="public-wrapper" style={{ marginBottom: "25px" }}>
              <Col className="text-wrapper">
                <div
                  className="IBM-text"
                  style={{ fontSize: "20px", fontWeight: "500" }}
                >
                  Friends
                </div>
              </Col>
              <Col>
                <div
                  className="IBM-text float-end"
                  style={{ fontSize: "20px", fontWeight: "500" }}
                >
                  {friendsList ? friendsList.length : 0}
                </div>
              </Col>
            </Row>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              {isFetched === "true" ? (
                friendsList?.length !== 0 ? (
                  friendsList!.map((h, index) => {
                    return (
                      <DisplayFriendsRow
                        listType={"friends"}
                        hook={setUpdate}
                        key={index}
                        userModel={h.userModel}
                      />
                    );
                  })
                ) : (
                  <span>No friends.</span>
                )
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </main>
  );
}

const DisplayFriendsRow = (props: any) => {

  const { show } = useContextMenu();

  function displayMenu(e: React.MouseEvent<HTMLElement>, targetUser: number) {
    e.preventDefault();
    show(e, {
      id: "onUser",
      props: {
        who: targetUser,
      },
    });
  }
  return (
    <main>
      <Container className="">
        <Row className="text-games">
          <Col md="auto" className="">
            <div
              id="clickableIcon"
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                displayMenu(e, props.userModel.id)
              }
              className="profile-pic-inside"
              style={{
                width: "30px",
                height: "30px",
                backgroundImage: `url("${props.userModel.avatar}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </Col>
          <Col
            id="clickableIcon"
            className="text-left public-hover"
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              displayMenu(e, props.userModel.id)
            }
          >
            <div>@{props.userModel.username}</div>
          </Col>
          <Col className="">
            <div id="clickableIcon" className="buttons-round-sm float-end">
              <i className="bi bi-caret-right-square-fill sm-icons" />
            </div>
            <div id="clickableIcon" className="buttons-round-sm float-end">
              <i className="bi bi-dpad-fill sm-icons" />
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};
