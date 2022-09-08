import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { INotifCxt, IUserStatus } from "./globals/Interfaces";
import { TAlert } from "./toasts/TAlert";
import { GameRequestCard } from "./routes/gameRequestCard";
import { gameInvitation } from "./routes/chat_modes/type/chat.type";

let LoginStatus = {
  islogged: false,
  setUserName: () => {},
};

export const UsernameCxt = createContext(LoginStatus);

export const UsersStatusCxt = createContext<IUserStatus[] | undefined>(
  undefined
);

export const NotifCxt = createContext<INotifCxt | undefined>(undefined);

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Token: localStorage.getItem("userToken"),
      },
    },
  },
};

export const socket = io(`${process.env.REACT_APP_BACKEND_SOCKET}`, socketOptions);

export default function App() {
  const [usersStatus, setUsersStatus] = useState<IUserStatus[] | undefined>(
    undefined
  );
  const [notifShow, setNotifShow] = useState(false);
  const [notifText, setNotifText] = useState("error");
  const [gameRequest, setGameRequest] = useState(false);
  const [gameInfo, setGameInfo] = useState<gameInvitation | undefined>(
    undefined
  );

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

  useEffect(() => {
    socket.on("game invitation", (game: gameInvitation) => {
      setGameRequest(true);
      setGameInfo(game);

      return () => {
        socket.off("game invitation");
      };
    });
  }, []);

  return (
    <div className="App">
      <UsernameCxt.Provider value={LoginStatus}>
        <UsersStatusCxt.Provider value={usersStatus}>
          <NotifCxt.Provider value={{ setNotifShow, setNotifText }}>
            <TAlert show={notifShow} setShow={setNotifShow} text={notifText} />
            <Outlet />
          </NotifCxt.Provider>
          <div
            className="card-disappear-click-zone"
            style={{ display: gameRequest ? "" : "none" }}
          >
            <div
              className="add-zone"
              onClick={(event) => event.stopPropagation()}
            >
              <GameRequestCard
                game={gameInfo}
                gameRequest={gameRequest}
                onGameRequest={() => {
                  setGameRequest((old) => {
                    return !old;
                  });
                }}
              />
            </div>
          </div>
        </UsersStatusCxt.Provider>
      </UsernameCxt.Provider>
    </div>
  );
}
