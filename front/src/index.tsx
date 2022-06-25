import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Game from "./routes/Game";
import LandingPage from "./routes/LandingPage"
import Leaderboard from "./routes/Leaderboard"
import User from "./routes/User";

const root = ReactDOM.createRoot(
  document.getElementById('root')!
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} >
          <Route path="Game" element={<Game />} />
          <Route path="LandingPage" element={<LandingPage />} />
          <Route path="Leaderboard" element={<Leaderboard />} >
            <Route path=":userId" element={<User/>} />
            </Route>
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