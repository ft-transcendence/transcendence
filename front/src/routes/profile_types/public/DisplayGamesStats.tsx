import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useContextMenu } from "react-contexify";
import { COnUser } from "../../../ContextMenus/COnUser";
import { getUserAvatarQuery } from "../../../queries/avatarQueries";
import { getGameStats } from "../../../queries/gamesQueries";

export default function DisplayGamesStats(props: any) {
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
      <COnUser />
      <Row>
        <Col className="">
          <Card className="p-5 main-card">
            <Card.Body className="public-card">
              <Row className="public-wrapper">
                <Col className="text-wrapper">
                  <div
                    className="IBM-text"
                    style={{ fontSize: "20px", fontWeight: "500" }}
                  >
                    Latest Games
                  </div>
                </Col>
                <Col>
                  <div
                    className="IBM-text float-end"
                    style={{ fontSize: "20px", fontWeight: "500" }}
                  >
                    {props.userInfo.gamesLost + props.userInfo.gamesWon}
                  </div>
                </Col>
              </Row>
              <Row className="text-title-games">
                <Col>Result</Col>
                <Col xs={4}>Opponent</Col>
                <Col>Rank</Col>
                <Col>Duration</Col>
                <Col xs={1}></Col>
              </Row>{" "}
              <div
                className=""
                style={{
                  maxHeight: "350px",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                {games !== undefined
                  ? games!.map((_h, index) => {
                      return (
                        <DisplayGamesRow key={index} game={games[index]} />
                      );
                    })
                  : null}
              </div>
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

  useEffect(() => {
    const getAvatar = async () => {
      const result_1: undefined | string | Blob | MediaSource =
        await getUserAvatarQuery(props.game.opponentId);
      if (result_1 !== undefined && result_1 instanceof Blob) {
        setAvatarURL(URL.createObjectURL(result_1));
      } else if (result_1 === "error: avatar")
        console.log("Could not get avatar of ", props.game.opponentId);
    };
    getAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function displayMenu(e: React.MouseEvent<HTMLElement>, targetUser: number) {
    e.preventDefault();
    show(e, {
      id: "onUser",
      props: {
        who: targetUser,
      },
    });
  }

  return (
    <main>
      <Row className="text-games">
        <Col>{props.game.victory ? "Victory" : "Defeat"}</Col>
        <Col xs={1}>
          <div
            className="profile-pic-inside"
            style={{
              width: "25px",
              height: "25px",
              backgroundImage: `url("${avatarURL}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </Col>
        <Col xs={3} className="text-right">
          <div
            onContextMenu={(e: React.MouseEvent<HTMLElement>) =>
              displayMenu(e, props.game.opponentId)
            }
          >
            @{props.game.opponentUsername}
          </div>
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
