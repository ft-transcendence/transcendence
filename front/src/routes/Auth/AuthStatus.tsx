import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../globals/contexts";

export const AuthStatus = () => {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!(localStorage!.getItem("userLogged")! === "true")) {
    return <Link to="/auth/signin">Sign in.</Link>;
  }
  return (
    <p>
      Welcome {auth.user}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
};
