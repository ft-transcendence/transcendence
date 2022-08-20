import { Outlet } from "react-router-dom";
import { CNavBar } from "../Components/Navbar";
import "../App.css";

export default function UserInterface() {
  return (
    <main className="Home">
        <CNavBar />
        <Outlet />
    </main>
  );
}
