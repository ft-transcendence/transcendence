import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { INotifCxt, IUserStatus } from "./globals/Interfaces";
import { TAlert } from "./toasts/TAlert";

let LoginStatus = {
  islogged: false,
  setUserName: () => {},
};

export const UsernameCxt = createContext(LoginStatus);

export const UsersStatusCxt = createContext<IUserStatus[] | undefined>(
  undefined
);

export const NotifCxt = createContext<INotifCxt | undefined>(undefined);

export const socket = io("ws://localhost:4000");

export default function App() {
  const [usersStatus, setUsersStatus] = useState<IUserStatus[] | undefined>(
    undefined
  );
  const [notifShow, setNotifShow] = useState(false);
  const [notifText, setNotifText] = useState("error");

  let userstatusTab: IUserStatus[] = [];

  useEffect(() => {
    socket.on("update-status", (data, str: string) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      userstatusTab = [];
      for (let i = 0; i <= data.length - 1; i++) {
        let newUser: IUserStatus = {
          key: data[i][0],
          userModel: { id: 0, status: -1 },
        };
        newUser.userModel.id = data[i][0];
        newUser.userModel.status = data[i][1];
        userstatusTab.push(newUser);
      }
      setUsersStatus(userstatusTab);
    });
    // return () => {
    //   socket.off('update-status')
    // }
  }, [usersStatus]);

  return (
    <div className="App">
      <UsernameCxt.Provider value={LoginStatus}>
        <UsersStatusCxt.Provider value={usersStatus}>
          <NotifCxt.Provider value={{ setNotifShow, setNotifText }}>
            <TAlert show={notifShow} setShow={setNotifShow} text={notifText} />
            <Outlet />
          </NotifCxt.Provider>
        </UsersStatusCxt.Provider>
      </UsernameCxt.Provider>
    </div>
  );
}
