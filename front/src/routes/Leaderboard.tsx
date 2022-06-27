import { NavLink, Outlet } from "react-router-dom";
import { GetUsers } from "../data";

export default function Leaderboard() {
  let users = GetUsers();
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
            <NavLink
              style={({ isActive }) => {
                return {
                  margin: "1rem 0",
                  color: isActive ? "red" : "",
                };
              }}
              to={`/leaderboard/${user.id}`}
              key={user.rank}
            >
            {user.username}
            </NavLink>
          </p>
          </>))}
      </nav>
      <Outlet />
    </div>
  );
}