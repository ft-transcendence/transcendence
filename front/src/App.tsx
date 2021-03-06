import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { createContext } from "react";
import { AuthStatus } from "./routes/Auth/AuthStatus";

let LoginStatus = {
  islogged: false,
  setUserName: () => {},
};

export const UsernameCxt = createContext(LoginStatus);

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
