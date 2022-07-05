import { Link, Outlet, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
export default function App() {

  const location = useLocation();

  if (location.pathname === "/game")
    return <Outlet />;

  return (
      <div className="App" style={{margin: "8px"}}>
        <h1>Transcendence</h1>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}
        >
          <Link to="/auth">Auth</Link> |{" "}
          <Link to="/game">Game</Link> |{" "}
          <Link to="/landing-page">Landing page</Link> |{" "}
          <Link to="/custom-page">Custom page</Link>
        </nav>
        <Outlet />
      </div>
  );
}