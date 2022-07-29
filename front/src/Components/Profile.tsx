import { useNavigate } from "react-router-dom";
import IconProfile from "../ressources/icons/Icon_Profile.svg";
import "./Profile.css";

export const CProfileIcon = () => {
  const navigate = useNavigate();
  return (
    <main>
      <div>
        <div className="round">
          <input
            type="image"
            alt="PrivateProfile"
            src={IconProfile}
            className="icon"
            onClick={() => {
              navigate("/app/private-profile");
            }}
          />
        </div>
      </div>
    </main>
  );
};
