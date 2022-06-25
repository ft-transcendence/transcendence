import { Link, Outlet } from "react-router-dom";
import { getUsers } from "../Data";

export default function Leaderboard() {
  let users = getUsers();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem",
        }}
      >
        {users.map((user) => (
          <>
          <p style={{ display: "block", margin: "1rem 0" }}>
            <b >rank #{user.rank} - </b>
            <Link
              to={`/Leaderboard/${user.id}`}
              key={user.rank}
            >
            {user.username}
            </Link>
          </p>
          </>))}
      </nav>
      <Outlet />
    </div>
  );
}