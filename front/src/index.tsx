import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import App from "./App";
import Game from "./routes/Game";
import Auth from "./routes/Auth";
import SignIn from "./routes/auth_modes/SignIn";
import SignUp from "./routes/auth_modes/SignUp";
import Home from "./routes/Home";
import Chat from "./routes/Chat";
import "./index.css";
import React from "react";
import UserPrivateProfile from "./routes/profile_types/UserPrivateProfile";
import { BlockedList, FriendsList } from "./routes/profile_types/FriendsList";

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
                <Home />
              </RequireAuth>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path="private-profile" element={<UserPrivateProfile />}>
              <Route index element={<FriendsList />} />
              <Route path="friends" element={<FriendsList />} />
              <Route path="blocked" element={<BlockedList />} />
            </Route>
            <Route path="chat" element={<Chat />} />
            <Route path="game" element={<Game />} />
            <Route path="*" element={<Navigate to="/app" />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth/signin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(callback, 1); // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 1);
  },
};

interface AuthContextType {
  user: string | null;
  signin: (user: string | null, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);

  let signin = (newUser: string | null, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      localStorage.clear();
      callback();
    });
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    return <Link to="/auth/signin">Sign in.</Link>;
  }

  return (
    <p>
      Welcome {auth.user}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth(); // subscribe to Auth context
  let location = useLocation(); // returns the current location object

  if (!auth.user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />; //  to replace the /login
    // route in the history stack so the user doesn't return to the login page when clicking the
    // back button after logging in
  }
  return children;
}
