import { useState, useEffect, useContext } from "react";
import {
  Col,
  Card,
  Container,
  Row,
  OverlayTrigger,
  Spinner,
} from "react-bootstrap";
import { useContextMenu } from "react-contexify";
import { useNavigate } from "react-router-dom";
import { UsersStatusCxt } from "../../../App";
import { renderTooltip } from "../../../Components/SimpleToolTip";
import { ItableRow, IUserStatus } from "../../../globals/Interfaces";
import { getUserAvatarQuery } from "../../../queries/avatarQueries";
import { getUserFriends } from "../../../queries/userFriendsQueries";

export default function DisplayUserFriends(props: any) {
  const usersStatus = useContext(UsersStatusCxt);
  const [friendsList, setFriendsList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState("false");
  const [isUpdated, setUpdate] = useState(false);

  let friends: ItableRow[] = [];

  useEffect(() => {
    const fetchDataFriends = async () => {
      const result = await getUserFriends(props.userInfo.id);
      if (result !== "error") return result;
    };

    const fetchDataFriendsAvatar = async (otherId: number) => {
      const result: undefined | string | Blob | MediaSource =
        await getUserAvatarQuery(otherId);
      if (result !== "error") return result;
      else
        return "https://img.myloview.fr/stickers/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg";
    };

    const fetchData = async () => {
      let fetchedFriends = await fetchDataFriends();

      if (fetchedFriends !== undefined && fetchedFriends.length !== 0) {
        for (let i = 0; i < fetchedFriends.length; i++) {
          let newRow: ItableRow = {
            key: i,
            userModel: { username: "", avatar: "", id: 0, status: -1 },
          };

          let avatar = await fetchDataFriendsAvatar(fetchedFriends[i].id);

          newRow.userModel.id = fetchedFriends[i].id;
          newRow.userModel.username = fetchedFriends[i].username;
          let found = undefined;
          if (usersStatus) {
            found = usersStatus.find(
              (x: IUserStatus) => x.key === fetchedFriends[i].id
            );
            if (found) newRow.userModel.status = found.userModel.status;
          }
          if (avatar !== undefined && avatar instanceof Blob)
            newRow.userModel.avatar = URL.createObjectURL(avatar);
          else if (avatar) newRow.userModel.avatar = avatar;
          friends.push(newRow);
        }
      }
      setFriendsList(friends);
      setFetched("true");
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated, usersStatus]);

  return (
    <main>
      <Col className="p-3">
        <Card className="p-3 main-card">
          <Card.Body>
            <Row className="public-wrapper" style={{ marginBottom: "25px" }}>
              <Col className="text-wrapper">
                <div
                  className="IBM-text"
                  style={{ fontSize: "1em", fontWeight: "500" }}
                >
                  Friends
                </div>
              </Col>
              <Col>
                <div
                  className="IBM-text float-end"
                  style={{ fontSize: "1em", fontWeight: "500" }}
                >
                  {friendsList ? friendsList.length : 0}
                </div>
              </Col>
            </Row>
            <div
              className="public-card-friends"
              style={{
                maxHeight: "150px",
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
                        myId={props.myId}
                      />
                    );
                  })
                ) : (
                  <span>No friends.</span>
                )
              ) : (
                <Spinner animation="border" />
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
  const navigate = useNavigate();

  function displayMenu(
    e: React.MouseEvent<HTMLElement>,
    targetUserId: number,
    targetUserUsername: string
  ) {
    e.preventDefault();
    show(e, {
      id: "onUser",
      props: {
        who: targetUserId,
        username: targetUserUsername,
      },
    });
  }

  const handleClickWatch = (otherId: number) => {
    navigate("/app/watch", { replace: false });
  };

  return (
    <main>
      <Container
        className="text-games"
        style={{
          marginTop: "calc(1vw + 15px)",
          marginBottom: "calc(1vw + 15px)",
        }}
      >
        <Row className="wrapper">
          <Col className="col-auto profile-pic-round-sm">
            <div className="profile-pic-wrapper-sm">
              <div
                className="profile-pic-inside-sm"
                style={{
                  backgroundImage: `url("${props.userModel.avatar}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                id="clickableIcon"
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  displayMenu(e, props.userModel.id, props.userModel.username)
                }
              ></div>
            </div>
            <div
              className={`status-private-sm ${
                props.userModel.status === 1
                  ? "online"
                  : props.userModel.status === 2
                  ? "ingame"
                  : props.userModel.status === 0
                  ? "offline"
                  : ""
              }`}
            ></div>
          </Col>
          <Col
            md={"auto"}
            id="clickableIcon"
            className="text-left public-hover"
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              displayMenu(e, props.userModel.id, props.userModel.username)
            }
          >
            <div>
              @
              {props.userModel.username.length > 10
                ? props.userModel.username.substring(0, 7) + "..."
                : props.userModel.username}
            </div>
          </Col>
          {props.myId !== 0 && props.userModel.id === props.myId ? null : (
            <Col className="">
              {props.userModel.status === 2 ? (
                <OverlayTrigger overlay={renderTooltip("Watch game")}>
                  <div
                    id="clickableIcon"
                    className="buttons-round-sm float-end"
                    onClick={(e: any) => {
                      handleClickWatch(props.userModel.id);
                    }}
                  >
                    <i className="bi bi-caret-right-square-fill sm-icons" />
                  </div>
                </OverlayTrigger>
              ) : (
                <div className="buttons-round-sm-disabled float-end">
                  <i className="bi bi-caret-right-square-fill sm-icons" />
                </div>
              )}
            </Col>
          )}
        </Row>
      </Container>
    </main>
  );
};
