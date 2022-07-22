import { ReactNode, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext, useAuth } from "../globals/contexts";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  let auth = useAuth(); // subscribe to Auth context
  let location = useLocation(); // returns the current location object

  if (localStorage!.getItem("userLogged")! === "true") {
    auth.signin(localStorage.getItem("userName"), () => {});
  } else {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }
  return children;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  let [user, setUser] = useState<any>(null);

  let signin = (newUser: string | null, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      localStorage.setItem("userLogged", "true");
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      localStorage.clear();
      localStorage.setItem("userLogged", "false");
      callback();
    });
  };
  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

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