import { io } from "socket.io-client";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { createContext } from "react";
import { AuthStatus } from ".";

let LoginStatus = {
  islogged: false,
  setUserName: () => {},
};

export const UsernameCxt = createContext(LoginStatus);

export const socket = io("ws://localhost:4000");

export default function App() {

  return (
      <div className="App">
        <UsernameCxt.Provider value={LoginStatus}>
        <AuthStatus />
          <Outlet />
        </UsernameCxt.Provider>
      </div>
  );
}
