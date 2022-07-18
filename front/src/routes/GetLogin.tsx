import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "..";

export const GetLogin = () => {
    const navigate = useNavigate();
    let access_token = useLocation().search.split("=")[1];
    console.log(access_token);
    localStorage.setItem("token", access_token);
    navigate("/");

    return (
        <h1> Login </h1>
    )
}