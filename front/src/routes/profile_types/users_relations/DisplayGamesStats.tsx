import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getGameStats } from "../../../queries/gamesQueries";

export default function DisplayGamesStats(props: any) {
  // const [isFetched, setIsFetched] = useState(false);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const getPlayedGamesStats = async () => {
      console.log("id: ", props.userInfo.id);
      const result_1 = await getGameStats(props.userInfo.id);
      if (result_1 !== "error") {
        console.log("result Games: ", result_1);
        setGames(result_1);
      } else console.log("Could not get games stats.");
    };
    getPlayedGamesStats();
  }, []);

  return (
    <main>
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
                      {props.userInfo.gamesLost + props.userInfo.gamesWon}
                    </div>
                  </Col>
                </Row>
                <Row className="text-title-games">
                  <Col>Result</Col>
                  <Col>Opponent</Col>
                  <Col>Rank</Col>
                  <Col>Duration</Col>
                  <Col></Col>
                </Row>
                {games !== undefined
                  ? games!.map((h, index) => {
                      return (
                        <DisplayGamesRow key={index} game={games[index]} />
                      );
                    })
                  : null}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

const DisplayGamesRow = (props: any) => {
  return (
    <Row>
      <Col>{props.game.victory ? "Victory" : "Fail"}</Col>
      <Col>{props.game.opponentUsername}</Col>
      <Col>{props.game.opponentRank}</Col>
      <Col>{props.game.duration}</Col>
      <Col></Col>
    </Row>
  );
};
