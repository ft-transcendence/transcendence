import { getUserData } from "./userQueries";

let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

<<<<<<< HEAD
const fetchPost = async (
=======
const fetchPost = (
>>>>>>> Mvaldes/feature/user private profile (#25)
  raw: string,
  userInfo: any,
  userSignIn: any,
  url: string
) => {
  let fetchUrl = "http://localhost:4000/auth/" + url;
<<<<<<< HEAD

  const rest = await fetch(fetchUrl, {
=======
  fetch(fetchUrl, {
>>>>>>> Mvaldes/feature/user private profile (#25)
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
<<<<<<< HEAD
  }).then((response) => response.json());
  storeToken(userInfo, rest);
  if (localStorage.getItem("userToken")) {
    await getUserData();
    if (localStorage.getItem("userName")) userSignIn();
  }
=======
  })
    .then(response => response.text())
    .then(result => storeToken(userInfo, result))
    .then(() => getUserData())
    .then(() => userSignIn())
    .catch((error) => console.log("error", error));
>>>>>>> Mvaldes/feature/user private profile (#25)
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

<<<<<<< HEAD
const storeToken = (userInfo: any, token: any) => {
  if (!(token.error === "Forbidden")) {
    console.log("token= ", token);
    localStorage.setItem("userToken", token.access_token);
    localStorage.setItem("userRefreshToken", token.refresh_token);
  }
  userInfo.clear();
=======
const storeToken = (userInfo: any, token: string) => {
  if (!token.includes("403")) {
    console.log("No error, storing token.");
    const subOne = token.replace('{"access_token":"', "");
    const subTwo = subOne.replace('"}', "");
    localStorage.setItem("userToken", subTwo);
    console.log("token: ", subTwo);
  }
  // userInfo.clear();
>>>>>>> Mvaldes/feature/user private profile (#25)
};
