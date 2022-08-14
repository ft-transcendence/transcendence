import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Game from "./routes/Game";
import Auth from "./routes/Auth/Auth";
import SignIn from "./routes/Auth/SignIn";
import SignUp from "./routes/Auth/SignUp";
import Home from "./routes/Home";
import Chat from "./routes/Chat";
import UserInterface from "./routes/UserInterface";
import UserPrivateProfile from "./routes/profile_types/UserPrivateProfile";
import { AuthProvider, RequireAuth } from "./hooks/AuthHooks";
import TwoFAValidation from "./routes/TwoFAValidation";
import Watch from "./routes/Watch";
import { BlockedList } from "./routes/profile_types/users_relations/BlockedList";
import { FriendsList } from "./routes/profile_types/users_relations/FriendsList";
import { PendingList } from "./routes/profile_types/users_relations/PendingList";
import LeaderBoard from "./routes/LeaderBoard";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/auth/signin" />} />
          <Route path="2FA" element={<TwoFAValidation />} />
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
              <Route path="pending" element={<PendingList />} />
              <Route path="blocked" element={<BlockedList />} />
            </Route>
            <Route
              path="chat"
              element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
              }
            />
            <Route path="leaderboard" element={<LeaderBoard />} />
            <Route path="game" element={<Game />} />
            <Route path="watch" element={<Watch />} />
            <Route path="*" element={<Navigate to="/app/home" />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth/signin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
