import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { userModel } from "../../globals/Interfaces";
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
  setUserInfo(userInfoInit);
};

export default function UserProfile() {
  let params = useParams();
  const [userInfo, setUserInfo] = useState<userModel>(userInfoInit);

  useEffect(() => {
    const fetchIsUser = async () => {
      let result;
      if (params.userName !== undefined) {
        result = await getOtherUser(+params.userName);
        console.log("result.length: ", result);
        initializeUser(result, setUserInfo);
      }
    };
    fetchIsUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <h1 className="app-title border">My account</h1>
      <Container className="p-5 h-100 border">
        <Row className="wrapper public-profile-header">
          <div className="p-2 public-profile-round">
            <div
              className="profile-pic-inside"
              style={{
                backgroundImage: `url("https://cdn.intra.42.fr/users/mvaldes.JPG")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
          <Col className=" content">
            <div className="profile-username-text">@{userInfo.username}</div>
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
                        {userInfo.username}
                      </div>
                    </Col>
                    <Col className=" text-right"></Col>
                  </Row>
                </div>
                <div>
                  <Row className="wrapper p-3"></Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
