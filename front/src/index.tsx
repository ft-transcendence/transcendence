import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Game from "./routes/Game";
import Auth from "./routes/Auth/Auth";
import SignIn from "./routes/Auth/SignIn";
import SignUp from "./routes/Auth/SignUp";
import Home from "./routes/Home";
import Chat from "./routes/Chat";
import Watch from "./routes/Watch";
import UserInterface from "./routes/UserInterface";
import UserPrivateProfile from "./routes/profile_types/UserPrivateProfile";
import { BlockedList, FriendsList } from "./routes/profile_types/FriendsList";
import { AuthProvider, RequireAuth } from "./hooks/AuthHooks";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Navigate to="/auth/signin" />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/auth/signin" />} />
          </Route>

          <Route
            path="app"
            element={
              <RequireAuth>
                <UserInterface />
              </RequireAuth>
            }
          >
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="private-profile" element={<UserPrivateProfile />}>
              <Route index element={<FriendsList />} />
              <Route path="friends" element={<FriendsList />} />
              <Route path="blocked" element={<BlockedList />} />
            </Route>
            <Route path="chat" element={<Chat />} />
            <Route path="game" element={<Game />} />
            <Route path="watch" element={<Watch />} />
            {/* <Route path="leaderboard" element={<Leaderboard />} /> */}
            <Route path="*" element={<Navigate to="/app/home" />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth/signin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
