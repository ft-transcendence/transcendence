import { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { ModifyEntry } from "./ModifyUserInfo";
import IconPen from "../../ressources/icons/IconPen.svg";
import { MUploadAvatar } from "../../modals/MUploadAvatar";
//import { UsersRelations } from "./FriendsList";
import { Activate2FA } from "../../modals/MActivateTwoFA";
// import { useUsername } from "../../hooks/UserInfoHooks";
import { UsersRelations } from "./users_relations/UsersRelations";
import { TwoFA } from "./TwoFA";

export default function UserPrivateProfile() {
  const [showUsername, setShowUsername] = useState(false);
  const onClickEditUsername = () => setShowUsername((curent) => !curent);

  const [showEmail, setShowEmail] = useState(false);
  const onClickEditEmail = () => setShowEmail((curent) => !curent);

  const [showFriends, setShowFriends] = useState(true);
  const onClickShowFriends = () => setShowFriends((curent) => !curent);

  const userInfoInit = {
    email: localStorage.getItem("userEmail"),
    userName: localStorage.getItem("userName"),
    auth: localStorage.getItem("userAuth"),
  };

  const [userInfo, setUserInfo] = useState(userInfoInit);

  const changeUserInfoHook = (e: any) => {
    setUserInfo((userInfo) => {
      return { ...userInfo, [e.target.name]: e.target.value };
    });
  };

  const [modalShow, setModalShow] = useState(false);
  const [modalShowAuth, setModalShowAuth] = useState(false);

  return (
    <main>
      <MUploadAvatar show={modalShow} onHide={() => setModalShow(false)} />
      <Activate2FA
        show={modalShowAuth}
        onHide={() => setModalShowAuth(false)}
      />

      <h1 className="app-title">My account</h1>
      <Container className="p-5 h-100">
        <Row className="wrapper">
          <div className="p-2 profile-pic-round">
            <div
              className="profile-pic-inside"
              style={{
                backgroundImage: `url("https://cdn.intra.42.fr/users/mvaldes.JPG")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <input
                type="image"
                alt="avatar of user"
                src={IconPen}
                className="edit-round-icon float-end"
                onClick={() => setModalShow(true)}
              />
            </div>
          </div>
          <Col className=" content">
            <div className="profile-username-text">@{userInfo.userName}</div>
            <div className="caption"> See Public Profile</div>
          </Col>
        </Row>
      </Container>

      <Container className="p-5">
        <Row className="flex">
          <Col className="col-6">
            <Card className="p-5 profile-card">
              <Card.Body>
                <div>
                  <Row className="wrapper p-3">
                    <Col className="text-wrapper">
                      <div className="IBM-text" style={{ fontSize: "20px" }}>
                        {" "}
                        USERNAME{" "}
                      </div>
                      <div className="ROBOTO-text" style={{ fontSize: "15px" }}>
                        {userInfo.userName}
                      </div>
                    </Col>
                    <Col className=" text-right">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                        onClick={() => {
                          setShowUsername(true);
                          setShowFriends(false);
                          setShowEmail(false);
                        }}
                      >
                        Edit
                      </button>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row className="wrapper p-3">
                    <Col className="text-wrapper">
                      <div className="IBM-text" style={{ fontSize: "20px" }}>
                        {" "}
                        EMAIL{" "}
                      </div>
                      <div className="ROBOTO-text" style={{ fontSize: "15px" }}>
                        {userInfo.email}
                      </div>
                    </Col>
                    <Col className=" text-right">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                        onClick={() => {
                          setShowEmail(true);
                          setShowFriends(false);
                          setShowUsername(false);
                        }}
                      >
                        Edit
                      </button>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row className="wrapper p-3">
                    <button
                      type="button"
                      className="col-5 btn btn-outline-primary btn-sm"
                      onClick={() => {
                        setShowEmail(false);
                        setShowFriends(false);
                        setShowUsername(false);
                      }}
                    >
                      Change Password
                    </button>
                  </Row>
                </div>
                <TwoFA
                  auth={userInfo.auth}
                  onClick={() => setModalShowAuth(true)}
                />
                <TwoFA auth={userInfo.auth} />
              </Card.Body>
            </Card>
          </Col>
          {showFriends ? <UsersRelations /> : null}
          {showUsername ? (
            <ModifyEntry
              toEdit="USERNAME"
              onClick={() => {
                onClickEditUsername();
                onClickShowFriends();
              }}
              changeUserInfoHook={changeUserInfoHook}
            />
          ) : null}
          {showEmail ? (
            <ModifyEntry
              toEdit="EMAIL"
              onClick={() => {
                onClickEditEmail();
                onClickShowFriends();
              }}
              changeUserInfoHook={changeUserInfoHook}
            />
          ) : null}
        </Row>
      </Container>
    </main>
  );
}
