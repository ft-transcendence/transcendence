import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const CNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="toolbar col-">
      <div className="toolbar-top space-around">
        <span id="clickableIcon">
          <i
            className={`bi bi-house icons ${
              location.pathname === "/app/home" ? "clicked" : "none"
            }`}
            onClick={() => {
              navigate("/app/home");
            }}
          />
        </span>
        <span id="clickableIcon">
          <i
            className={`bi bi-bar-chart-fill icons ${
              location.pathname === "/app/leaderboard" ? "clicked" : "none"
            }`}
            onClick={() => {
              navigate("/app/leaderboard");
            }}
          ></i>
        </span>
        <span id="clickableIcon">
          <i
            className={`bi bi-chat-left icons ${
              location.pathname === "/app/chat" ? "clicked" : "none"
            }`}
            onClick={() => {
              navigate("/app/chat");
            }}
          ></i>
        </span>
        <span id="clickableIcon">
          <i
            className={`bi bi-joystick icons ${
              location.pathname === "/app/game" ? "clicked" : "none"
            }`}
            onClick={() => {
              navigate("/app/game");
            }}
          ></i>
        </span>
        <span id="clickableIcon">
          <i
            className={`bi bi-cast icons ${
              location.pathname === "/app/watch" ? "clicked" : "none"
            }`}
            onClick={() => {
              navigate("/app/watch");
            }}
          ></i>
        </span>
      </div>
    </div>
  );
};
