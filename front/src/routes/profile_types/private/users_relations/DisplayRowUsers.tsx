import { Container, Row, Col } from "react-bootstrap";
import { useContextMenu } from "react-contexify";
import {
  removeFriendQuery,
  blockUserQuery,
  unblockUserQuery,
  addFriendQuery,
  denyInviteQuery,
} from "../../../../queries/userFriendsQueries";

export const DisplayRow = (props: any) => {
  const { show } = useContextMenu();

  function displayMenu(e: React.MouseEvent<HTMLElement>, targetUser: number) {
    e.preventDefault();
    show(e, {
      id: "onUserSimple",
      props: {
        who: targetUser,
      },
    });
  }
  
  return (
    <main>
      <Container className="">
        <Row className="wrapper">
          <Col
            className="col-auto profile-pic-round-sm"
            id="clickableIcon"
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              displayMenu(e, props.userModel.id)
            }
          >
            <div
              className={`profile-pic-wrapper ${
                props.userModel.status === 2 ? "ingame" : ""
              }`}
            >
              <div
                className="profile-pic-inside-sm"
                style={{
                  backgroundImage: `url("${props.userModel.avatar}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
            <div
              className={`status-private ${
                props.userModel.status === 1
                  ? "online"
                  : props.userModel.status === 2
                  ? "ingame"
                  : "offline"
              }`}
            ></div>
          </Col>
          <Col
            className="content"
            id="clickableIcon"
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              displayMenu(e, props.userModel.id)
            }
          >
            <div className="profile-username-text" style={{ fontSize: "15px" }}>
              @{props.userModel.username}
            </div>
          </Col>
          <Col>
            {props.listType === "friends" ? (
              <ButtonsFriends
                id={props.userModel.id}
                hook={props.hook}
                state={props.state}
              />
            ) : props.listType === "blocked" ? (
              <ButtonsBlocked
                id={props.userModel.id}
                hook={props.hook}
                state={props.state}
              />
            ) : props.listType === "pending" ? (
              <ButtonsPending
                id={props.userModel.id}
                hook={props.hook}
                state={props.state}
              />
            ) : null}
          </Col>
        </Row>
      </Container>
    </main>
  );
};

const ButtonsFriends = (props: any) => {
  return (
    <main>
      <Col className="float-end">
        <button
          type="button"
          className="IBM-text btn btn-sm text-button"
          onClick={async () => {
            await removeFriendQuery(props.id);
            props.hook(!props.state);
          }}
        >
          Remove
        </button>
      </Col>
      <Col className="float-end">
        <button
          type="button"
          className="IBM-text btn btn-sm text-button"
          onClick={async () => {
            await blockUserQuery(props.id);
            props.hook(!props.state);
          }}
        >
          Block
        </button>
      </Col>
    </main>
  );
};

const ButtonsBlocked = (props: any) => {
  return (
    <main>
      <Col className=""></Col>
      <Col className="float-end">
        <button
          type="button"
          className="IBM-text btn btn-sm text-button"
          onClick={async () => {
            await unblockUserQuery(props.id);
            props.hook(!props.state);
          }}
        >
          Unblock
        </button>
      </Col>
    </main>
  );
};

const ButtonsPending = (props: any) => {
  return (
    <main>
      <Col className="float-end">
        <button
          type="button"
          className="IBM-text btn btn-sm text-button"
          onClick={async () => {
            await addFriendQuery(props.id);

            props.hook(!props.state);
          }}
        >
          Accept
        </button>
      </Col>
      <Col className="float-end">
        <button
          type="button"
          className="IBM-text btn btn-sm text-button"
          onClick={async () => {
            await denyInviteQuery(props.id);
            props.hook(!props.state);
          }}
        >
          Ignore
        </button>
      </Col>
    </main>
  );
};
