import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import GamePage from "./routes/GamePage";
import LandingPage from "./routes/LandingPage";
import Leaderboard from "./routes/Leaderboard";
import User from "./routes/User";
import CustomPage from "./routes/CustomPage";
import "./index.css";
import Auth from "./routes/Auth";
import SignIn from "./routes/SignIn";

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
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>Select an auth mode</p>
                    </main>
                  }
                />
                <Route path="auth/signin" element={<SignIn/>} />
                {/* <Route path="auth/signin" element={<SignIn/>} /> */}
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
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
                }
            />
        </Route>
      </Routes>
    </BrowserRouter>
  // </AuthProvider>
);