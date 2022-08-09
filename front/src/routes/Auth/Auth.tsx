import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Outlet } from "react-router-dom";
import { IUserInfo } from "../../globals/Interfaces";
import { signUp, signIn } from "../../queries/authQueries";
import { GUserInputsRefs } from "../../globals/variables";
import { useAuth } from "../../globals/contexts";
import { getUserData } from "../../queries/userQueries";

export default function Auth() {
  let navigate = useNavigate();
  let auth = useAuth();
  let location = useLocation();
  
  // Use a callback to avoid re-rendering
  const userSignIn = useCallback(() => {
    let username = localStorage.getItem("userName");
    console.log("username: ", username);
    if (username)
      auth.signin(username, () => {
        navigate("/app/private-profile", { replace: true });
      });
      console.log("user is signed in");
  }, [navigate, auth]);

  // useEffect to get access token from URL
    useEffect(() => {
    // get access token from URL Query
    const access_token = location.search.split("=")[1];
    if (access_token) {
      console.log(access_token);
      localStorage.setItem("userToken", access_token);
      // getUserData is a fetch that might take time. In order for sign in
      // to operate after the function, it needs to use await, asyn and .then
      // keywords. Otherwise, things might happen in the wrong order.
      const fetchData = async () => {
       const data = await getUserData(); 
      }
      // sign in the user
      fetchData()
      .then (() => userSignIn())
      }
    } , [location.search, userSignIn]);


  const handleSubmit = (event: any) => {
    let userInfo: IUserInfo = {
      username: null,
      email: null,
      password: null,
      clear: function () {
        this.username = null;
        this.email = null;
        this.password = null;
      },
    };
 
    event.preventDefault();
    if (GUserInputsRefs.username.current?.value)
      userInfo.username = GUserInputsRefs.username.current.value;
    userInfo.email = GUserInputsRefs!.email!.current!.value;
    userInfo.password = GUserInputsRefs!.password!.current!.value;
    if (userInfo.username && userInfo.email && userInfo.password)
      signUp(userInfo, userSignIn);
    else signIn(userInfo, userSignIn);
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <Outlet />

          <Form.Group className="mb-3">
            <Form.Label className="form-test ">EMAIL</Form.Label>
            <Form.Control
              ref={GUserInputsRefs.email}
              type="email"
              placeholder="name@example.com"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-test" htmlFor="inputPassword1">
              PASSWORD
            </Form.Label>
            <Form.Control
              ref={GUserInputsRefs.password}
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              placeholder="****"
            />
            <Form.Text className="form-help-block" id="passwordHelpBlock" muted>
              Your password must be 8-20 characters long.
            </Form.Text>
          </Form.Group>
          {/* USE LINK TO GET USER FROM 42 API */}
          <Button variant="secondary" className="submit-button" size="sm" href="http://localhost:4000/auth/42">
            Sign in with 42
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="submit-button"
            size="sm"
          >
            Submit
          </Button>
          <p className="text-secondary mt-2">
            Forgot your &nbsp; <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  );
}