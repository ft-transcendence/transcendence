import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Activate2FA } from "../../../modals/MActivateTwoFA";
import { MUploadAvatar } from "../../../modals/MUploadAvatar";
import { getAvatarQuery } from "../../../queries/avatarQueries";
import { ModifyEntry } from "./ModifyUserInfo";
import { TwoFA } from "./TwoFA";
import { UsersRelations } from "./users_relations/UsersRelations";
import "./Profiles.css"
import IconPen from "../../../ressources/icons/Icon_Pen.svg";

export default function UserPrivateProfile() {
  const navigate = useNavigate();

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
  const [authStatus, setAuthStatus] = useState(userInfo.auth);
  const [avatarURL, setAvatarURL] = useState("");
  const [avatarFetched, setAvatarFetched] = useState(false);

  useEffect(() => {
    const getAvatar = async () => {
      const result_1: undefined | string | Blob | MediaSource =
        await getAvatarQuery();
      if (result_1 !== undefined && result_1 instanceof Blob) {
        setAvatarURL(URL.createObjectURL(result_1));
      } else if (result_1 === "error: avatar")
        console.log("Could not get avatar of self.");
    };
    getAvatar();
  }, [avatarFetched]);

  return (
    <main>
      <MUploadAvatar
        show={modalShow}
        onHide={() => setModalShow(false)}
        isAvatarUpdated={() => setAvatarFetched(!avatarFetched)}
      />
      <Activate2FA
        show={modalShowAuth}
        onSubmit={() => setAuthStatus("true")}
        onHide={() => setModalShowAuth(false)}
      />

      <h1 className="app-title">My account</h1>
      <Container className="p-5 h-100">
        <Row className="wrapper">
          <div className="p-2 profile-pic-round">
            <div
              className="profile-pic-inside"
              style={{
                backgroundImage: `url("${avatarURL}")`,
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
            <span
              id="clickableIcon"
              className="caption"
              onClick={() =>
                navigate("/app/public/" + localStorage.getItem("userID"))
              }
            >
              See Public Profile
            </span>
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
                        USERNAME
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
                        EMAIL
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
                <TwoFA
                  auth={authStatus}
                  onClick={() => setModalShowAuth(true)}
                  onDeactivate={() => setAuthStatus("false")}
                />
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
