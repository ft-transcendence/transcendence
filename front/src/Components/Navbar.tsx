import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../globals/contexts";
import "./Navbar.css";

const GetIcons = (props: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  let auth = useAuth();

  const url = props.url;
  const fill =
    url === "private-profile"
      ? "person"
      : url === "leaderboard"
      ? "trophy"
      : url === "chat"
      ? "chat-left-dots"
      : url === "game"
      ? "dpad"
      : url === "watch"
      ? "caret-right-square"
      : "box-arrow-right";

  return (
    <div>
      <i
        id="clickableIcon"
        className={`bi bi-${fill} icons thick ${
          location.pathname === "/app/" + url ? "hide" : "current"
        }`}
        onClick={
          url === "logout"
            ? () => {
                auth.signout(() => navigate("/"));
              }
            : () => {
                navigate("/app/" + url);
              }
        }
      />
      <i
        id="clickableIcon"
        className={`bi bi-${fill}-fill icons thin ${
          location.pathname === "/app/" + url ? "current" : "hide"
        }`}
        onClick={() => {
          navigate("/app/" + url);
        }}
      />
    </div>
  );
};

export const CNavBar = () => {
  return (
    <div className="toolbar col-">
      <div className="toolbar-top space-around">
        <GetIcons url="private-profile" />
        <GetIcons url="leaderboard" />
        <GetIcons url="chat" />
        <GetIcons url="game" />
        <GetIcons url="watch" />
        <GetIcons url="logout" />
      </div>
    </div>
  );
};