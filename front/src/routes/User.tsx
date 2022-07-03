import { useParams, useNavigate, useLocation } from "react-router-dom";
import { GetUser, DeleteUser } from "../data";

export default function User() {
    let params = useParams();
    let navigate = useNavigate();
    let location = useLocation();

    if (typeof params.userId === 'string')
    {
        let user = GetUser(parseInt(params.userId));
        return (
            <main style={{ padding: "1rem" }}>
            <p> Username: {user!.username} </p>
            <p> Name: {user!.name}: {user!.surname}  </p>
            <p> Wins: {user!.wins}  </p>
            <p> Loses: {user!.loses} </p>
            </main>
        );
    }
    else
        return <h2>Nada</h2>;
  }