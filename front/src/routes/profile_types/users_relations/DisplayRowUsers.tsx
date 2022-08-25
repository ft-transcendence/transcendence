import { Container, Row, Col } from "react-bootstrap";
import {
  removeFriendQuery,
  blockUserQuery,
  unblockUserQuery,
  denyInviteQuery,
  addFriendQuery,
} from "../../../queries/userFriendsQueries";

export const DisplayRow = (props: any) => {
  return (
    <main>
       <Container className="">
        <Row className="wrapper">
          <Col className="col-auto profile-pic-round-sm">
            <div className="profile-pic-wrapper">
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
                props.userModel.status === 1 ? "online" : "offline"
              }`}
            ></div>
          </Col>
          <Col className="content">
            <div className="profile-username-text" style={{ fontSize: "18px" }}>
              @{props.userModel.username}
            </div>
          </Col>
          <Col>
            {props.listType === "friends" ? (
              <ButtonsFriends id={props.userModel.id} hook={props.hook} />
            ) : props.listType === "blocked" ? (
              <ButtonsBlocked id={props.userModel.id} hook={props.hook} />
            ) : props.listType === "pending" ? (
              <ButtonsPending id={props.userModel.id} hook={props.hook} />
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
          className="IBM-text btn btn-sm"
          style={{ fontSize: "15px" }}
          onClick={async () => {
            await removeFriendQuery(props.id);
            props.hook(true);
          }}
        >
          Remove
        </button>
      </Col>
      <Col className="float-end">
        <button
          type="button"
          className="IBM-text btn btn-sm"
          style={{ fontSize: "15px" }}
          onClick={async () => {
            await blockUserQuery(props.id);
            props.hook(true);
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
      <Col className="">
        <button
          type="button"
          className="IBM-text btn btn-sm"
          style={{ fontSize: "15px" }}
          onClick={async () => {
            await unblockUserQuery(props.id);
            props.hook(true);
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
      <Col className="">
        <button
          type="button"
          className="IBM-text btn btn-sm"
          style={{ fontSize: "15px" }}
          onClick={async () => {
            await addFriendQuery(props.id);
            props.hook(true);
          }}
        >
          Accept
        </button>
      </Col>
      <Col className="">
        <button
          type="button"
          className="IBM-text btn btn-sm"
          style={{ fontSize: "15px" }}
          onClick={async () => {
            await denyInviteQuery(props.id);
            props.hook(true);
          }}
        >
          Ignore
        </button>
      </Col>
    </main>
  );
};
