import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./app";
import Game from "./routes/game";
import LandingPage from "./routes/landingPage"
import Leaderboard from "./routes/leaderboard"
import User from "./routes/user";
import CustomPage from "./routes/customPage"

const root = ReactDOM.createRoot(
  document.getElementById('root')!
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} >
          <Route path="game" element={<Game />} />
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
);