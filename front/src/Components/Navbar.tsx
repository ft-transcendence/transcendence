import { useNavigate } from "react-router-dom";
// import IconHome from "../ressources/icons/Icon_Home.svg";
// import IconHomeS from "../ressources/icons/Icon_Home_S.svg";
import IconChat from "../ressources/icons/Icon_Chat.svg";
import IconFight from "../ressources/icons/Icon_Fight.svg";
import IconLeaderboard from "../ressources/icons/Icon_Leaderboard.svg";
import IconWatch from "../ressources/icons/Icon_Watch.svg";
import "./Navbar.css";
import { useState } from "react";

export const CNavBar = () => {
  const navigate = useNavigate();

  const [clicked, setClick] = useState(false);

  return (
    <div className="toolbar col-">
      <div className="toolbar-top space-around ">
        <i className="bi bi-house"></i>
        <input
          type="image"
          alt="Leaderboard"
          id="Leaderboard"
          src={IconLeaderboard}
          className="icons"
          // onClick={() => {
          //   navigate("/app/leaderboard");
          // }}
        />
        <input
          type="image"
          alt="Chat"
          id="Chat"
          src={IconChat}
          className="icons"
          onClick={() => {
            navigate("/app/chat");
          }}
        />
        <input
          type="image"
          alt="Fight"
          id="Fight"
          src={IconFight}
          className="icons"
          onClick={() => {
            navigate("/app/game");
          }}
        />
        <input
          type="image"
          alt="Watch"
          id="Watch"
          src={IconWatch}
          className="icons"
          onClick={() => {
            navigate("/app/watch");
          }}
        />
      </div>
    </div>
  );
};
