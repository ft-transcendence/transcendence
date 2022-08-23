import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GUserInputsRefs } from "../../globals/variables";

export default function SignUp() {
  let navigate = useNavigate();

  async function handleClick(event: any) {
    event.preventDefault();
    navigate("/auth/signin");
  }

  return (
    <div>
      <h3 className="Auth-form-title">Sign up.</h3>
      <div className="text-secondary">
        Already registered? &nbsp;
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={handleClick}>
          Sign in.
        </a>
      </div>
      <Form.Group className="mb-3">
        <Form.Label className="form-test">USERNAME</Form.Label>
        <Form.Control
          ref={GUserInputsRefs.username}
          type="text"
          placeholder="JaneDoe"
        />
      </Form.Group>
    </div>
  );
}
