import { getUserData } from "./userQueries";

/* Generate 2FA QR code */
export const twoFAGenerate = () => {
  return fetchPost(null, "generate");
};

/* Validate 2FA code when signin in  */
export const twoFAAuth = (twoFAcode: string, email: string) => {
  let raw = JSON.stringify({
    username: email,
    twoFAcode: twoFAcode,
  });
  console.log('raw', raw);
  return fetchValid(raw, "authenticate", userSignIn);
};

/* Turn on 2FA for signed in user */
export const twoFAOn = (code: string) => {
  let raw = JSON.stringify({
    twoFAcode: code,
  });
  return fetchPost(raw, "turn-on");
};

const authRawHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  return myHeaders;
};

/* Use to TURN ON 2FA */
const fetchPost = async (body: any, url: string) => {
  let fetchUrl = "http://localhost:4000/auth/2fa/" + url;

  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: authRawHeader(),
      body: body,
      redirect: "follow",
    });
    const result_1 = await response.json();
    return result_1;
  } catch (error) {
    return console.log("error", error);
  }
};

/* Need a different fetch for 2FA auth */
const fetchValid = async (body: any, url: string, userSignIn: any) => {
  let fetchUrl = "http://localhost:4000/auth/2fa/" + url;
  let myHeaders = new Headers();
  // need to send JSON header
  myHeaders.append("Content-Type", "application/json");
  try {
    console.log('body is', body);
    
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    }).then((response) => response.json());
    storeToken(response);
    // Similar to authqueries logic
    if (localStorage.getItem("userToken")) {
      await getUserData();
      if (localStorage.getItem("userName")) userSignIn();
    }
  } catch (error) {
    return console.log("error", error);
  }
};

/* Duplicate of authqueries function */
const storeToken = (token: any) => {
  if (!(token.error === "Forbidden")) {
    console.log("access token = ", token.access_token);
    console.log("refresh token = ", token.access_token);
    localStorage.setItem("userToken", token.access_token);
    localStorage.setItem("userRefreshToken", token.refresh_token);
  }
};

/* NOT IMPLEMENTED */
function userSignIn() {
  throw new Error("Function not implemented.");
}
