import { useNavigate } from "react-router-dom";

export default function SignIn() {
  let navigate = useNavigate();

  async function handleClick(event: any) {
    event.preventDefault();
    navigate("/auth/signup");
  }

  return (
    <div>
      <h3 className="Auth-form-title">Sign in.</h3>
      <div className="text-secondary">
        Don't have an account yet? &nbsp;
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={handleClick}>
          Sign up.
        </a>
      </div>
    </div>
  );
}
