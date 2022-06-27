import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>Transcendence</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/Game">Game</Link> |{" "}
        <Link to="/Landing-page">Landing page</Link> |{" "}
        <Link to="/Leaderboard">Leaderboard example</Link> |{" "}
        <Link to="/Custom-page">Custom page</Link>
      </nav>
      <Outlet />
    </div>
  );
}