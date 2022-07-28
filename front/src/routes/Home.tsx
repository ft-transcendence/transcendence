import { Outlet } from "react-router-dom";
import IconHome from "../ressources/icons/Icon_Home.svg";
import IconChat from "../ressources/icons/Icon_Chat.svg";
import IconFight from "../ressources/icons/Icon_Fight.svg";
import IconFriends from "../ressources/icons/Icon_Friends.svg";
import IconLeaderboard from "../ressources/icons/Icon_Leaderboard.svg";
import IconWatch from "../ressources/icons/Icon_Watch.svg";

import "./Home.css";

export default function Home() {
  return (
    <main className="Home">
      {/* <h2>App</h2> */}
      {/* <nav
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
      </nav> */}
      <div className="toolbar">
        <div className="toolbar-top space-around ">
          <input type="image" alt="Home" src={IconHome} className="icons" />
          <input
            type="image"
            alt="Friends"
            src={IconFriends}
            className="icons"
          />
          <input
            type="image"
            alt="Leaderboard"
            src={IconLeaderboard}
            className="icons"
          />
          <input type="image" alt="Chat" src={IconChat} className="icons" />
          <input type="image" alt="Fight" src={IconFight} className="icons" />
          <input type="image" alt="Watch" src={IconWatch} className="icons" />
        </div>
      </div>
      <Outlet></Outlet>
    </main>
  );
}
