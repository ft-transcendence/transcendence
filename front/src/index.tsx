import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import GamePage from "./routes/GamePage";
import LandingPage from "./routes/LandingPage";
import Leaderboard from "./routes/Leaderboard";
import User from "./routes/User";
import CustomPage from "./routes/CustomPage";
import Auth from "./routes/Auth";
import SignIn from "./routes/auth_modes/SignIn";
import SignUp from "./routes/auth_modes/SignUp";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById('root')!
);
root.render(
  // <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
            <Route path="/auth" element={<Auth />} >
              <Route
                  index
                  element={<Navigate to="/auth/signin" />}
              />
              <Route path="signin" element={<SignIn/>} />
              <Route path="signup" element={<SignUp/>} />
              <Route path="*" element={<Navigate to="/auth/signin" />} />
            </Route>
            <Route path="game" element={<GamePage />} />
            <Route path="landing-page" element={<LandingPage />} />
            <Route path="leaderboard" element={<Leaderboard />} >
              <Route
                index
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>Select a user</p>
                  </main>
                }
              />
              <Route path=":userId" element={<User/>} />
              </Route>
            <Route path="custom-page" element={<CustomPage />} ></Route>
            <Route
              path="*"
              element={<Navigate to="/landing-page" />}
            />
        </Route>
      </Routes>
    </BrowserRouter>
  // </AuthProvider>
);