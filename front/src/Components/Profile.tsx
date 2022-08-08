import { useLocation, useNavigate } from "react-router-dom";
import "./Profile.css";

export const CProfileIcon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <main>
      <div>
        <div className="round">
          <span id="clickableIcon">
            <i
              className={`bi bi-person iconProfile ${
                location.pathname === "/app/private-profile"
                  ? "clicked"
                  : "none"
              }`}
              onClick={() => {
                navigate("/app/private-profile");
              }}
            />
          </span>
        </div>
      </div>
    </main>
  );
};
