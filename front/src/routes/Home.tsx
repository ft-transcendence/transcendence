import { Outlet, useNavigate } from "react-router-dom";
import IconHome from "../ressources/icons/Icon_Home.svg";
import IconChat from "../ressources/icons/Icon_Chat.svg";
import IconFight from "../ressources/icons/Icon_Fight.svg";
import IconLeaderboard from "../ressources/icons/Icon_Leaderboard.svg";
import IconWatch from "../ressources/icons/Icon_Watch.svg";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="Home">
      <div className="toolbar col-">
        <div className="toolbar-top space-around ">
          <input
            type="image"
            alt="Home"
            src={IconHome}
            className="icons"
            onClick={() => {
              navigate("/app/home");
            }}
          />
          <input
            type="image"
            alt="Leaderboard"
            src={IconLeaderboard}
            className="icons"
            // onClick={() => {
            //   navigate("/app/leaderboard");
            // }}
          />
          <input
            type="image"
            alt="Chat"
            src={IconChat}
            className="icons"
            onClick={() => {
              navigate("/app/chat");
            }}
          />
          <input
            type="image"
            alt="Fight"
            src={IconFight}
            className="icons"
            onClick={() => {
              navigate("/app/game");
            }}
          />
          <input
            type="image"
            alt="Watch"
            src={IconWatch}
            className="icons"
            onClick={() => {
              navigate("/app/watch");
            }}
          />
        </div>
      </div>
      <Outlet></Outlet>
    </main>
  );
}
