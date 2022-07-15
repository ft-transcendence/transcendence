import { useState } from "react";
import {Card, Col, Container, Row } from "react-bootstrap";
import { ModifyEntry } from "./ModifyUserInfo";
// import { useUsername } from "../../hooks/UserInfoHooks";


export default function UserPrivateProfile() {
  const [showUsername, setShowUsername] = useState(false);
  const onClickEditUsername = () => setShowUsername((curent) => !curent);
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

  return (
    <main>
      <h1 className="app-title">My account</h1>
      <Container className="p-5 h-100 wrapper">
        <Row className="">
          <Col className="">
            <div className="profile-pic-round"></div>
          </Col>
          <Col className=" content">
            <div className="profile-username-text">@{userInfo.userName}</div>
            <div className="caption"> See Public Profile</div>
          </Col>
        </Row>
      </Container>

      <Container className="p-5">
        <Row className="flex p-4">
          <Col className="p-3 col-6">
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
                          onClickEditUsername();
                          hideEmail();
                          hidePhone();
                          hidePass();
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
                          onClickEditEmail();
                          hideUsername();
                          hidePhone();
                          hidePass();
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
                          onClickEditPhone();
                          hideUsername();
                          hideEmail();
                          hidePass();
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
                        onClickEditPass();
                        hideUsername();
                        hideEmail();
                        hidePhone();
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
          {showUsername ? (
            <ModifyEntry
              toEdit="USERNAME"
              onClick={onClickEditUsername}
              changeUserInfoHook={changeUserInfoHook}
            />
          ) : null}
          {showEmail ? (
            <ModifyEntry
              toEdit="EMAIL"
              onClick={onClickEditEmail}
              changeUserInfoHook={changeUserInfoHook}
            />
          ) : null}
          {showPhone ? (
            <ModifyEntry toEdit="PHONE" onClick={onClickEditPhone} />
          ) : null}
          {showPass ? (
            <ModifyEntry toEdit="PASSWORD" onClick={onClickEditPass} />
          ) : null}
        </Row>
      </Container>
    </main>
  );
}
