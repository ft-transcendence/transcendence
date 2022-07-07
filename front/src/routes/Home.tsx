import { Link, Outlet } from "react-router-dom";

export default function Home() {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>App</h2>
        <nav
            style={{
              borderBottom: "solid 1px",
              paddingBottom: "1rem",
            }}
          >
            <Link to="/app/private-profile">Private profile</Link> |{" "}
          </nav>
          <Outlet></Outlet>
      </main>
    );
  }
