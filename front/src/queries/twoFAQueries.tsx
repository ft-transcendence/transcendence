import { storeToken } from "./authQueries";
import { getUserData } from "./userQueries";

/* Generate 2FA QR code */
export const twoFAGenerate = () => {
  return fetchPost(null, "generate", null);
};

/* Validate 2FA code when signin in  */
export const twoFAAuth = (
  twoFAcode: string,
  email: string,
  userSignIn: any
) => {
  let raw = JSON.stringify({
    username: email,
    twoFAcode: twoFAcode,
  });
  return fetchPost(raw, "authenticate", userSignIn);
};

/* Turn on 2FA for signed in user */
export const twoFAOn = (code: string) => {
  let raw = JSON.stringify({
    twoFAcode: code,
  });
  console.log("TURN ON");
  return fetchPost(raw, "turn-on", null);
};

export const twoFAOff = () => {
  return fetchPost(null, "turn-off", null);
};

const authRawHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  return myHeaders;
};

const fetchPost = async (body: any, url: string, userSignIn: any) => {
  let fetchUrl = process.env.REACT_APP_BACKEND_URL + "/auth/2fa/" + url;

  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: authRawHeader(),
      body: body,
      redirect: "follow",
    });
    const result_1 = await response.json();
    if (!response.ok) {
      console.log("POST error on ", url);
      return null;
    }
    if (url !== "generate") {
      storeToken(result_1);
      if (url === "authenticate") {
        if (localStorage.getItem("userToken")) {
          await getUserData();
          if (localStorage.getItem("userName")) userSignIn();
          else return null;
        }
      }
    }
    return result_1;
  } catch (error) {
    return console.log("error", error);
  }
};
