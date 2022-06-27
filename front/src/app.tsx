import { Link, Outlet } from "react-router-dom";

export default function app() {
  return (
    <div>
      <h1>Transcendence</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/game">Game</Link> |{" "}
        <Link to="/landing-page">Landing page</Link> |{" "}
        <Link to="/leaderboard">Leaderboard example</Link> |{" "}
        <Link to="/custom-page">Custom page</Link>
      </nav>
      <Outlet />
    </div>
  );
}