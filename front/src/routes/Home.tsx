import { Col, Row } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export default function Home() {
  return (
    <main style={{height:'100%'}}>
      <h2>App</h2>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/app/private-profile">Private profile</Link> |{"  "}
        <Link to="/app/chat">Chat</Link> |{"  "}
        <Link to="/app/leader-board">Leader Board</Link> |{"  "}
        <Link to="/app/game">Game</Link> |{"  "}
        <Link to="/app/watch">Watch</Link>
      </nav>
      <div className="container-sm border">
      </div>
      {/* <Outlet></Outlet> */}
    </main>
  );
}
