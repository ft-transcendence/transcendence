import { Outlet } from "react-router-dom";
import { CNavBar } from "../Components/Navbar";
import "../App.css";
import { Col, Row } from "react-bootstrap";

export default function UserInterface() {
  return (
    <main className="Home">
        <CNavBar />
        <Outlet />
    </main>
  );
}
