// import React from 'react';
// import { io } from "socket.io-client";
// import { getImpliedNodeFormatForFile } from 'typescript';
// import { ServerResponse } from 'http';
import { Link, Outlet, useLocation } from "react-router-dom";

export default function App() {

  const location = useLocation();


  if (location.pathname === "/game")
    return <Outlet />;

  return (
    <div style={{margin: "8px"}}>
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