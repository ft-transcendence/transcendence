import { useParams } from "react-router-dom";
import { getUser } from "../Data";

export default function User() {
    let params = useParams();

    if (typeof params.userId === 'string')
    {
        let user = getUser(parseInt(params.userId));
        // if (user)
        // {
            return (
                <main style={{ padding: "1rem" }}>
                <p> Username: {user!.username} </p>
                <p> Name: {user!.name}: {user!.surname}  </p>
                <p> Wins: {user!.wins}  </p>
                <p> Loses: {user!.loses} </p>
                </main>
            );
        // }
    }
    else
        return <h2>Nada</h2>;
  }