import { ReactNode, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext, useAuth } from "../globals/contexts";
import { logOut } from "../queries/authQueries";
import { TAlert } from "../toasts/TAlert";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  let auth = useAuth();
  let location = useLocation();

  if (localStorage!.getItem("userLogged")! === "true") {
    auth.signin(localStorage.getItem("userName"), () => {});
  } else {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }
  return children;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  let [user, setUser] = useState<any>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [notifText, setNotifText] = useState("Error");

  let signin = (newUser: string | null, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      localStorage.setItem("userLogged", "true");
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      const postLogout = async () => {
        const result = await logOut();
        if (result !== "error") {
          setNotifText("See you soon " + user + " !");
          setShowNotif(true);
          setUser(null);
          localStorage.clear();
          localStorage.setItem("userLogged", "false");
          callback();
        } else {
          setNotifText("Could not log out. Please, try again.");
          setShowNotif(true);
        }
      };
      postLogout();
    });
  };
  let value = { user, signin, signout };

  return (
    <main>
      <TAlert show={showNotif} setShow={setShowNotif} text={notifText} />
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </main>
  );
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
