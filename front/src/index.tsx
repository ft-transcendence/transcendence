import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Game from "./routes/Game";
import Auth from "./routes/Auth/Auth";
import SignIn from "./routes/Auth/SignIn";
import SignUp from "./routes/Auth/SignUp";
import Chat from "./routes/Chat";
import UserInterface from "./routes/UserInterface";
import { AuthProvider, RedirectWhenAuth, RequireAuth } from "./hooks/AuthHooks";
import TwoFAValidation from "./routes/TwoFAValidation";
import Watch from "./routes/Watch";
import LeaderBoard from "./routes/LeaderBoard";
import UserPrivateProfile from "./routes/profile_types/private/UserPrivateProfile";
import { BlockedList } from "./routes/profile_types/private/users_relations/BlockedList";
import { FriendsList } from "./routes/profile_types/private/users_relations/FriendsList";
import { PendingList } from "./routes/profile_types/private/users_relations/PendingList";
import UserPublicProfile from "./routes/profile_types/public/UserPublicProfile";
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
            <Route
              path="signin"
              element={
                <RedirectWhenAuth>
                  <SignIn />
                </RedirectWhenAuth>
              }
            />
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
            <Route index element={<UserPrivateProfile />} />
            <Route path="private-profile" element={<UserPrivateProfile />}>
              <Route index element={<FriendsList />} />
              <Route path="friends" element={<FriendsList />} />
              <Route path="pending" element={<PendingList />} />
              <Route path="blocked" element={<BlockedList />} />
            </Route>
            <Route path="public/:userName" element={<UserPublicProfile />} />
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
            <Route path="privateGame" element={<Game pvtGame={true} />} />
            <Route path="watch" element={<Watch />} />
            <Route path="*" element={<Navigate to="/app/private-profile" />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth/signin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
