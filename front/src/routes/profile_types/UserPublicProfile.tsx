import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams, useRoutes } from "react-router-dom";
import { userModel } from "../../globals/Interfaces";
import {
  getAvatarQuery,
  getUserAvatarQuery,
} from "../../queries/avatarQueries";
import { getOtherUser } from "../../queries/otherUserQueries";
import "./UserPublicProfile.css";

const userInfoInit: userModel = {
  id: 0,
  username: "",
  avatar: "",
  friends: [],
  gamesLost: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  playTime: 0,
  rank: 0,
  score: 0,
  winRate: 0,
};

const initializeUser = (result: any, setUserInfo: any) => {
  userInfoInit.id = result.id;
  userInfoInit.username = result.username;
  userInfoInit.avatar = result.avatar;
  userInfoInit.friends = result.frirends;
  userInfoInit.gamesLost = result.gamesLost;
  userInfoInit.gamesPlayed = result.gamesPlayed;
  userInfoInit.gamesWon = result.gamesWon;
  userInfoInit.playTime = result.playTime;
  userInfoInit.rank = result.rank;
  userInfoInit.score = result.score;
  userInfoInit.winRate = result.winRate;
  console.log("result.winRate", result.winRate);
  setUserInfo(userInfoInit);
};

export default function UserProfile() {
  let params = useParams();
  const [userInfo, setUserInfo] = useState<userModel>(userInfoInit);
  const [isFetched, setIsFetched] = useState(false);
  const [avatarURL, setAvatarURL] = useState("");
  const [isUser, setIsUser] = useState(true);
  // const [avatarFetched, setAvatarFetched] = useState(false);

  useEffect(() => {
    const getAvatar = async () => {
      console.log("fetch avatar of :", userInfoInit.id);
      const result_1: undefined | string | Blob | MediaSource =
        await getUserAvatarQuery(userInfoInit.id);
      if (result_1 !== undefined && result_1 instanceof Blob) {
        setAvatarURL(URL.createObjectURL(result_1));
      } else if (result_1 === "error: avatar")
        console.log("Could not get avatar of ", userInfoInit.id);
    };
    if (isFetched && userInfoInit.id) getAvatar();
  }, [isFetched]);

  useEffect(() => {
    const fetchIsUser = async () => {
      let result;
      if (!isFetched && params.userName !== undefined) {
        result = await getOtherUser(+params.userName);
        if (result !== "error") {
          console.log("result: ", result);
          initializeUser(result, setUserInfo);
          setIsFetched(true);
        } else setIsUser(false);
      }
    };
    fetchIsUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  return (
    <main>
      {isUser && isFetched ? (
        <main>
          {" "}
          <h1 className="app-title border">My account</h1>
          <Container className="p-5 border">
            <Row className="wrapper public-profile-header">
              <div className="p-2 public-profile-round">
                <div
                  className="profile-pic-inside"
                  style={{
                    backgroundImage: `url("${avatarURL}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
              <Col className="content">
                <div className="public-username-text">@{userInfo.username}</div>
                <div className="public-rank-text"> Rank #</div>
              </Col>
              <Col>
                <div id="clickableIcon" className="buttons-round-big float-end">
                  <i className="bi bi-dpad-fill big-icons" />
                </div>
                <div id="clickableIcon" className="buttons-round-big float-end">
                  <i className="bi bi-caret-right-square-fill big-icons" />
                </div>
                <div id="clickableIcon" className="buttons-round-big float-end">
                  <i className="bi bi-chat-left-dots-fill big-icons" />
                </div>
              </Col>
            </Row>
          </Container>
          <Container className="p-5 text-center">
            <Row
              className="ROBOTO-text"
              style={{ fontSize: "20px", fontWeight: "400" }}
            >
              <Col>Win Rate</Col>
              <Col>Total Win</Col>
              <Col>Play Time</Col>
            </Row>
            <Row className="IBM-text text-huge">
              <Col>{userInfo.winRate}</Col>
              <Col>{userInfo.gamesWon}</Col>
              <Col>{Math.floor(userInfo.playTime / 1000)}s</Col>
            </Row>
          </Container>
          <Container className="p-5">
            <Row className="flex">
              <Col className="col-6">
                <Card className="p-3 public-card">
                  <Card.Body>
                    <Row className="wrapper p-1">
                      <Col className="text-wrapper">
                        <div
                          className="IBM-text"
                          style={{ fontSize: "20px", fontWeight: "500" }}
                        >
                          Latest Games
                        </div>
                      </Col>
                      <Col className="">
                        <div
                          className="IBM-text float-end"
                          style={{ fontSize: "20px", fontWeight: "500" }}
                        >
                          {userInfo.gamesLost + userInfo.gamesWon}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      ) : isUser && !isFetched ? null : (
        <main>User does not exist.</main>
      )}
    </main>
  );
}
