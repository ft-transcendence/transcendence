import { io } from "socket.io-client";
import { Link, Outlet, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { createContext } from "react";
import { AuthStatus } from ".";

let LoginStatus = {
  islogged: false,
  setUserName: () => {},
};

export const UsernameCxt = createContext(LoginStatus);

export const socket = io("ws://localhost:4000");

export default function App() {
  const location = useLocation();

  if (location.pathname === "/game" || location.pathname === "/chat") return <Outlet />;

  return (
    <div className="App" style={{ margin: "8px" }}>
      <UsernameCxt.Provider value={LoginStatus}>
        <AuthStatus />
        <h1>Transcendence</h1>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}
        >
          <Link to="/auth">Auth</Link> |{" "}
          <Link to="/home">Home(sign in protected)</Link> |{" "}
          <Link to="/game">Game</Link> | <Link to="/chat">chat</Link> |{" "}
          <Link to="/landing-page">Landing page</Link> |{" "}
          <Link to="/custom-page">Custom page</Link>
        </nav>
        <Outlet />
      </UsernameCxt.Provider>
    </div>
  );
}
