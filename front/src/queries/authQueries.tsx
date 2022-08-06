import { getUserData } from "./userQueries";

let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const fetchPost = async (
  raw: string,
  userInfo: any,
  userSignIn: any,
  url: string
) => {
  let fetchUrl = "http://localhost:4000/auth/" + url;

  const rest = await fetch(fetchUrl, {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  }).then((response) => response.json());
  // check if user is 2FA
  if (rest.twoFA) {
    // redirect to 2FA page
    const url = '/2FA?user=' + rest.username;
    window.location.href = url;
    //console.log(rest.twoFA);
  } else {
  storeToken(userInfo, rest);
  if (localStorage.getItem("userToken")) {
    await getUserData();
    if (localStorage.getItem("userName")) userSignIn();
  }
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

const storeToken = (userInfo: any, token: any) => {
  if (!(token.error === "Forbidden")) {
    console.log("token= ", token.access_token);
    localStorage.setItem("userToken", token.access_token);
    localStorage.setItem("userRefreshToken", token.refresh_token);
  }
  userInfo.clear();
};