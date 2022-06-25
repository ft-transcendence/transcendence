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
        <Link to="/game">Game</Link> |{" "}
        <Link to="/LandingPage">LandingPage</Link> |{" "}
        <Link to="/Leaderboard">Leaderboard</Link>
      </nav>
      <Outlet />
    </div>
  );
}