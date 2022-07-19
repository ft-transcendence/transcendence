import { Router, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export const GetLogin = () => {
    const navigate = useNavigate();
    let access_token = useLocation().search.split("=")[1];
    
    return (
        <h1> Login </h1>
    )
}