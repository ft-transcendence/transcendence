import { useState, useEffect } from "react";
import { Col, Card, Container, Row } from "react-bootstrap";
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
            <div
              style={{
                maxHeight: "350px",
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
  return (
    <main>
      <Container className="">
        <Row className="border">
          <Col className="" xs={1}>
            <div
              className="profile-pic-inside"
              style={{
                width: "20px",
                height: "20px",
                backgroundImage: `url("${props.userModel.avatar}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </Col>
          <Col className="content" style={{ paddingLeft: "0px" }}>
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
              fight
            </button>
          </Col>
          <Col className="">
            <button
              type="button"
              className="IBM-text btn btn-sm"
              style={{ fontSize: "15px" }}
            >
              watch
            </button>
          </Col>
        </Row>
      </Container>
    </main>
  );
};
