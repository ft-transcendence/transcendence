import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IUserStatus } from "./globals/Interfaces";

let LoginStatus = {
  islogged: false,
  setUserName: () => {},
};

export const UsernameCxt = createContext(LoginStatus);

export const UsersStatusCxt = createContext<IUserStatus[] | undefined>(
  undefined
);

const socketURL = '/connect'

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
          Token: localStorage.getItem("userToken"),
      }
    }
  },
  path: '/api/status',
};

export const socket = io(socketURL, socketOptions);

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

socket.on("error", (err) => {
console.log(`error due to ${err.message}`);
});

socket.on("connect", () => {
  console.log("connected to status");
});

export default function App() {
  const [usersStatus, setUsersStatus] = useState<IUserStatus[] | undefined>(
    undefined
  );
  let userstatusTab: IUserStatus[] = [];

  useEffect(() => {
    socket.on("update-status", (data, str: string) => {
      userstatusTab = [];
      for (let i = 0; i <= data.length - 1; i++) {
        let newUser: IUserStatus = {
          key: data[i][0],
          userModel: { id: 0, status: 0 },
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
          <Outlet />
        </UsersStatusCxt.Provider>
      </UsernameCxt.Provider>
    </div>
  );
}
