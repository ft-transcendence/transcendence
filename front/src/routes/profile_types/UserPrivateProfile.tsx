import { useState } from "react";
<<<<<<< HEAD
import { Card, Col, Container, Row } from "react-bootstrap";
import { ModifyEntry } from "./ModifyUserInfo";
import IconPen from "../../ressources/icons/IconPen.svg";
=======
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { ModifyEntry } from "./ModifyUserInfo";
import IconPen from "../../ressources/icons/IconPen.svg";
import ProfilePic from "../../ressources/imgs/mvaldes.jpeg";
>>>>>>> Mvaldes/feature/user private profile (#25)
import { MUploadAvatar } from "../../modals/MUploadAvatar";
import { UsersRelations } from "./FriendsList";
// import { useUsername } from "../../hooks/UserInfoHooks";

export default function UserPrivateProfile() {
  const [showUsername, setShowUsername] = useState(false);
  const onClickEditUsername = () => setShowUsername((curent) => !curent);
<<<<<<< HEAD

  const [showEmail, setShowEmail] = useState(false);
  const onClickEditEmail = () => setShowEmail((curent) => !curent);

  const [showPhone, setShowPhone] = useState(false);
  const onClickEditPhone = () => setShowPhone((curent) => !curent);

  const [showPass, setShowPass] = useState(false);
  const onClickEditPass = () => setShowPass((curent) => !curent);

  const [showFriends, setShowFriends] = useState(true);
  const onClickShowFriends = () => setShowFriends((curent) => !curent);
=======
  const hideUsername = () => setShowUsername(false);

  const [showEmail, setShowEmail] = useState(false);
  const onClickEditEmail = () => setShowEmail((curent) => !curent);
  const hideEmail = () => setShowEmail(false);

  const [showPhone, setShowPhone] = useState(false);
  const onClickEditPhone = () => setShowPhone((curent) => !curent);
  const hidePhone = () => setShowPhone(false);

  const [showPass, setShowPass] = useState(false);
  const onClickEditPass = () => setShowPass((curent) => !curent);
  const hidePass = () => setShowPass(false);

  const [showFriends, setShowFriends] = useState(true);
  const onClickShowFriends = () => setShowFriends((curent) => !curent);
  const hideFriends = () => setShowFriends(false);
>>>>>>> Mvaldes/feature/user private profile (#25)

  const userInfoInit = {
    email: localStorage.getItem("userEmail"),
    userName: localStorage.getItem("userName"),
    phone: "",
    pass: localStorage.getItem("userPassword"),
  };

  const [userInfo, setUserInfo] = useState(userInfoInit);

  const changeUserInfoHook = (e: any) => {
    setUserInfo((userInfo) => {
      return { ...userInfo, [e.target.name]: e.target.value };
    });
  };

  const [modalShow, setModalShow] = useState(false);

  return (
    <main>
      <MUploadAvatar show={modalShow} onHide={() => setModalShow(false)} />

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
<<<<<<< HEAD
                alt="avatar of user"
=======
>>>>>>> Mvaldes/feature/user private profile (#25)
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
<<<<<<< HEAD
                          setShowUsername(true);
                          setShowFriends(false);
                          setShowEmail(false);
                          setShowPhone(false);
                          setShowPass(false);
=======
                          onClickEditUsername();
                          onClickShowFriends();
                          hideEmail();
                          hidePhone();
                          hidePass();
>>>>>>> Mvaldes/feature/user private profile (#25)
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
<<<<<<< HEAD
                          setShowEmail(true);
                          setShowFriends(false);
                          setShowUsername(false);
                          setShowPhone(false);
                          setShowPass(false);
=======
                          onClickEditEmail();
                          onClickShowFriends();
                          hideUsername();
                          hidePhone();
                          hidePass();
>>>>>>> Mvaldes/feature/user private profile (#25)
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
                        PHONE{" "}
                      </div>
                      <div className="ROBOTO-text" style={{ fontSize: "15px" }}>
                        ******7535
                      </div>
                    </Col>
                    <Col>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                      >
                        Remove
                      </button>
                    </Col>
                    <Col>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                        onClick={() => {
<<<<<<< HEAD
                          setShowPhone(true);
                          setShowFriends(false);
                          setShowUsername(false);
                          setShowEmail(false);
                          setShowPass(false);
=======
                          onClickEditPhone();
                          onClickShowFriends();
                          hideUsername();
                          hideEmail();
                          hidePass();
>>>>>>> Mvaldes/feature/user private profile (#25)
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
<<<<<<< HEAD
                        setShowPass(true);
                        setShowFriends(false);
                        setShowUsername(false);
                        setShowEmail(false);
                        setShowPhone(false);
=======
                        onClickEditPass();
                        onClickShowFriends();
                        hideUsername();
                        hideEmail();
                        hidePhone();
>>>>>>> Mvaldes/feature/user private profile (#25)
                      }}
                    >
                      Change Password
                    </button>
                  </Row>
                </div>
                <div>
                  <Row className="wrapper p-3">
                    <Col className="text-wrapper col-8">
                      <div className="IBM-text" style={{ fontSize: "15px" }}>
                        {" "}
                        Two Factor authentifcation enabled{" "}
                      </div>
                    </Col>
                    <Col>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm submit-button float-end"
                      >
                        Remove 2FA
                      </button>
                    </Col>
                  </Row>
                </div>
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
          {showPhone ? (
            <ModifyEntry
              toEdit="PHONE"
              onClick={() => {
                onClickEditPhone();
                onClickShowFriends();
              }}
              changeUserInfoHook={changeUserInfoHook}
            />
          ) : null}
          {showPass ? (
            <ModifyEntry
              toEdit="PASSWORD"
              onClick={() => {
                onClickEditPass();
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
