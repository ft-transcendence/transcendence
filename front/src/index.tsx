import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Game from "./routes/Game";
import LandingPage from "./routes/LandingPage";
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
            <Route path="game" element={<Game />} />
            <Route path="landing-page" element={<LandingPage />} />
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