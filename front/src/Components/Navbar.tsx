import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../globals/contexts";
import "./Navbar.css";

export const CNavBar = () => {
  let auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="toolbar col-">
      <div className="toolbar-top space-around">
        <span id="clickableIcon">
          <i
            className={`bi icons ${
              location.pathname === "/app/private-profile"
                ? "bi-person-fill cliked"
                : "bi-person none"
            }`}
            onClick={() => {
              navigate("/app/private-profile");
            }}
          ></i>
        </span>
        <span id="clickableIcon">
          <i
            className={`bi bi-trophy icons ${
              location.pathname === "/app/leaderboard" ? "clicked" : "none"
            }`}
            onClick={() => {
              navigate("/app/leaderboard");
            }}
          ></i>
        </span>
        <span id="clickableIcon">
          <i
            className={`bi bi-chat-left-dots icons ${
              location.pathname === "/app/chat" ? "clicked" : "none"
            }`}
            onClick={() => {
              navigate("/app/chat");
            }}
          ></i>
        </span>
        <span id="clickableIcon">
          <i
            className={`bi bi-controller icons ${
              location.pathname === "/app/game" ? "clicked" : "none"
            }`}
            onClick={() => {
              navigate("/app/game");
            }}
          ></i>
        </span>
        <span id="clickableIcon">
          <i
            className={`bi bi-caret-right-square icons ${
              location.pathname === "/app/watch" ? "clicked" : "none"
            }`}
            onClick={() => {
              navigate("/app/watch");
            }}
          ></i>
        </span>
        <span id="clickableIcon">
          <i
            className={`bi bi-box-arrow-right icons ${
              location.pathname === "/app/private-profile" ? "clicked" : "none"
            }`}
            onClick={() => {
              auth.signout(() => navigate("/"));
            }}
          ></i>
        </span>
      </div>
    </div>
  );
};
