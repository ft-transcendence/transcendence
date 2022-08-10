import { useNavigate } from "react-router-dom";
import { getUserData } from "./userQueries";

let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

// const NavigateTwoFA = (username: string) => {
//   console.log("username navigate: ", username);
//   let navigate = useNavigate();
//   navigate("/2FA?user=" + username);
// };

const fetchPost = async (
  raw: string,
  userInfo: any,
  userSignIn: any,
  url: string
) => {
  let fetchUrl = "http://localhost:4000/auth/" + url;

  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    });
    const result_1 = await response.json();
    if (!response.ok) return console.log("POST error on ", url);
    // check if user is 2FA
    if (result_1.twoFA) {
      // redirect to 2FA page
      const url = "/2FA?user=" + result_1.username;
      window.location.href = url;
      // NavigateTwoFA(rest.username);
    } else {
      userInfo.clear();
      storeToken(result_1);
      if (localStorage.getItem("userToken")) {
        await getUserData();
        if (localStorage.getItem("userName")) userSignIn();
      }
    }
  } catch (error) {
    return console.log("error", error);
  }
};

export const signIn = (userInfo: any, userSignIn: any) => {
  let raw = JSON.stringify({
    username: userInfo.email,
    password: userInfo.password,
  });
  fetchPost(raw, userInfo, userSignIn, "signin");
};

export const signUp = (userInfo: any, userSignIn: any) => {
  let raw = JSON.stringify({
    email: userInfo.email,
    password: userInfo.password,
    username: userInfo.username,
  });
  fetchPost(raw, userInfo, userSignIn, "signup");
};

export const storeToken = (token: any) => {
  console.log("token= ", token.access_token);
  console.log("refresh token = ", token.access_token);
  localStorage.setItem("userToken", token.access_token);
  localStorage.setItem("userRefreshToken", token.refresh_token);
};
