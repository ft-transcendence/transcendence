import { getUserData } from "./userQueries";

let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const fetchPost = (
  raw: string,
  userInfo: any,
  userSignIn: any,
  url: string
) => {
  let fetchUrl = "http://localhost:4000/auth/" + url;
  fetch(fetchUrl, {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  })
    .then(response => response.text())
    .then(result => storeToken(userInfo, result))
    .then(() => getUserData())
    .then(() => userSignIn())
    .catch((error) => console.log("error", error));
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

const storeToken = (userInfo: any, token: string) => {
  if (!token.includes("403")) {
    console.log("No error, storing token.");
    const subOne = token.replace('{"access_token":"', "");
    const subTwo = subOne.replace('"}', "");
    localStorage.setItem("userToken", subTwo);
    console.log("token: ", subTwo);
  }
  // userInfo.clear();
};
