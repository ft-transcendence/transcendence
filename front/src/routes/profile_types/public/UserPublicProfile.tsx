import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useParams } from "react-router-dom";
import DisplayGamesStats from "./DisplayGamesStats";
import { IUserStatus, userModel } from "../../../globals/Interfaces";
import { getUserAvatarQuery } from "../../../queries/avatarQueries";
import { getOtherUser } from "../../../queries/otherUserQueries";
import "./UserPublicProfile.css";
import DisplayUserFriends from "./DisplayUserFriends";
import { COnUser } from "../../../ContextMenus/COnUser";
import { renderTooltip } from "../../../Components/SimpleToolTip";
import { UsersStatusCxt } from "../../../App";

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
  userInfoInit.rank = result.rank === null ? "∞" : result.rank;
  userInfoInit.score = result.score;
  userInfoInit.winRate = result.winRate === null ? 0 : result.winRate;
  setUserInfo(userInfoInit);
};

export default function UserProfile() {
  const usersStatus = useContext(UsersStatusCxt);
  let params = useParams();
  const [userInfo, setUserInfo] = useState<userModel>(userInfoInit);
  const [isFetched, setIsFetched] = useState(false);
  const [avatarURL, setAvatarURL] = useState("");
  const [isUser, setIsUser] = useState(true);
  const [status, setStatus] = useState(0);

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
  }, [isFetched, usersStatus]);

  useEffect(() => {
    let found = undefined;
    if (isFetched && usersStatus && userInfo) {
      found = usersStatus.find((x: IUserStatus) => x.key === userInfo.id);
      if (found) setStatus(found.userModel.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersStatus, isFetched, userInfo]);

  return (
    <main>
      {isUser && isFetched ? (
        <main
          className="p-5"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <COnUser />
          <div className="public-left">
            <Container className="p-5">
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
                <Col md="auto" className="">
                  <div className="public-username-text">
                    @{userInfo.username}
                  </div>
                  <div className="public-rank-text"> Rank #{userInfo.rank}</div>
                  <div
                    className="IBM-text"
                    style={{ fontSize: "0.8em", fontWeight: "400" }}
                  >
                    {" "}
                    {status === 1
                      ? "online"
                      : status === 2
                      ? "playing"
                      : "offline"}
                  </div>
                </Col>
                <Col className="">
                  {status === 2 ? (
                    <OverlayTrigger overlay={renderTooltip("Watch game")}>
                      <div
                        id="clickableIcon"
                        className="buttons-round-big float-end"
                      >
                        <i className="bi bi-caret-right-square-fill big-icons" />
                      </div>
                    </OverlayTrigger>
                  ) : (
                    <div
                      className="buttons-round-big-disabled float-end"
                    >
                      <i className="bi bi-caret-right-square-fill big-icons" />
                    </div>
                  )}
                  {status === 1 ? (
                    <OverlayTrigger overlay={renderTooltip("Challenge")}>
                      <div
                        id="clickableIcon"
                        className="buttons-round-big float-end"
                      >
                        <i className="bi bi-dpad-fill big-icons" />
                      </div>
                    </OverlayTrigger>
                  ) : (
                    <div
                      className="buttons-round-big-disabled float-end"
                    >
                      <i className="bi bi-dpad-fill big-icons" />
                    </div>
                  )}
                  <OverlayTrigger overlay={renderTooltip("Add friend")}>
                    <div
                      id="clickableIcon"
                      className="buttons-round-big float-end"
                    >
                      <i className="bi bi-person-plus-fill big-icons" />
                    </div>
                  </OverlayTrigger>
                </Col>
              </Row>
            </Container>
            <Container className="p-5 text-center">
              <Row
                className="ROBOTO-text"
                style={{ fontSize: "1.2em", fontWeight: "400" }}
              >
                <Col>Win Rate</Col>
                <Col>Total Win</Col>
                <Col>Play Time</Col>
              </Row>
              <Row className="IBM-text text-huge">
                <Col>{Math.round(userInfo.winRate * 10) / 10}</Col>
                <Col>{userInfo.gamesWon}</Col>
                <Col>{Math.floor(userInfo.playTime / 1000)}s</Col>
              </Row>
            </Container>
            <Container className="p-5">
              <DisplayGamesStats userInfo={userInfo} />
            </Container>
          </div>
          <div className="public-right">
            <DisplayUserFriends userInfo={userInfo} />
          </div>
        </main>
      ) : isUser && !isFetched ? null : (
        <main>User does not exist.</main>
      )}
    </main>
  );
}
