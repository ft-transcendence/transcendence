import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useContextMenu } from "react-contexify";
import { UsersStatusCxt } from "../../../App";
import { IUserStatus } from "../../../globals/Interfaces";
import { getUserAvatarQuery } from "../../../queries/avatarQueries";
import { getGameStats } from "../../../queries/gamesQueries";

export default function DisplayGamesStats(props: any) {
  const usersStatus = useContext(UsersStatusCxt);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const getPlayedGamesStats = async () => {
      const result_1 = await getGameStats(props.userInfo.id);
      if (result_1 !== "error") {
        setGames(result_1);
      } else console.log("Could not get games stats.");
    };
    getPlayedGamesStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <Row>
        <Col className="">
          <Card className="p-3 main-card">
            <Card.Body className="public-card">
              <Row className="public-wrapper">
                <Col className="text-wrapper">
                  <div
                    className="IBM-text"
                    style={{ fontSize: "1em", fontWeight: "500" }}
                  >
                    Latest Games
                  </div>
                </Col>
                <Col>
                  <div
                    className="IBM-text float-end"
                    style={{ fontSize: "1em", fontWeight: "500" }}
                  >
                    {games.length}
                  </div>
                </Col>
              </Row>
              {games && games.length !== 0 ? (
                <div>
                  <Row className="text-title-games">
                    <Col>Result</Col>
                    <Col xs={4}>Opponent</Col>
                    <Col>Rank</Col>
                    <Col>Duration</Col>
                    <Col xs={1}></Col>
                  </Row>
                  <div
                    className=""
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {games !== undefined
                      ? games!.map((_h, index) => {
                          return (
                            <DisplayGamesRow
                              key={index}
                              game={games[index]}
                              statuses={usersStatus}
                            />
                          );
                        })
                      : null}
                  </div>
                </div>
              ) : (
                <Row className="text-title-games">
                  <Col>No game history.</Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
  );
}

const DisplayGamesRow = (props: any) => {
  const { show } = useContextMenu();
  const [avatarURL, setAvatarURL] = useState("");
  const [status, setStatus] = useState(0);

  useEffect(() => {
    const getOppStatus = () => {
      let found = undefined;

      if (props.statuses) {
        found = props.statuses.find(
          (x: IUserStatus) => x.key === props.game.opponentId
        );
        if (found) setStatus(found.userModel.status);
      }
    };
    getOppStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.statuses]);

  useEffect(() => {
    const getAvatar = async () => {
      const result_1: undefined | string | Blob | MediaSource =
        await getUserAvatarQuery(props.game.opponentId);
      if (result_1 !== undefined && result_1 instanceof Blob) {
        setAvatarURL(URL.createObjectURL(result_1));
      } else if (result_1 === "error")
        setAvatarURL(
          "https://img.myloview.fr/stickers/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg"
        );
    };
    getAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <main className="text-games">
      <Row className="wrapper">
        <Col>{props.game.victory ? "Victory" : "Defeat"}</Col>
        <Col className="col-auto profile-pic-round-sm">
          <div
            className={`profile-pic-wrapper-sm ${status === 2 ? "ingame" : ""}`}
          >
            <div
              className="profile-pic-inside-sm"
              style={{
                backgroundImage: `url("${avatarURL}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              id="clickableIcon"
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                displayMenu(
                  e,
                  props.game.opponentId,
                  props.game.opponentUsername
                )
              }
            ></div>
          </div>
          <div
            className={`status-private-sm ${
              status
                ? status === 1
                  ? "online"
                  : status === 2
                  ? "ingame"
                  : props.userModel.status === 0
                  ? "offline"
                  : ""
                : null
            }`}
          ></div>
        </Col>
        <Col
          xs={3}
          id="clickableIcon"
          className="text-left public-hover"
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            displayMenu(e, props.game.opponentId, props.game.opponentUsername)
          }
        >
          @
          {props.game.opponentUsername.length > 10
            ? props.game.opponentUsername.substring(0, 7) + "..."
            : props.game.opponentUsername}
        </Col>
        <Col className="text-center">#{props.game.opponentRank}</Col>
        <Col className="text-center">
          {Math.floor(props.game.duration / 1000)}s
        </Col>
        <Col xs={1}></Col>
      </Row>
    </main>
  );
};
