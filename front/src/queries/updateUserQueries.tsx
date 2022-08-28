import { authContentHeader, authHeader } from "./headers";

export const updateAvatarQuery = (file: any) => {
  var formdata = new FormData();
  formdata.append("avatar", file.files[0], "avatar.jpeg");

  return fetchPost(formdata, "update_avatar", authHeader, file);
};

export const updateUsernameQuery = (username: string) => {
  var raw = JSON.stringify({
    username: username,
  });
  return fetchPost(raw, "update_username", authContentHeader, username);
};

export const updateEmailQuery = (email: string) => {
  var raw = JSON.stringify({
    email: email,
  });
  return fetchPost(raw, "update_email", authContentHeader, email);
};

const fetchPost = async (
  bodyContent: any,
  url: string,
  header: any,
  data: string
) => {
  let fetchUrl = process.env.REACT_APP_BACKEND_URL + "/users/" + url;

  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: header(),
      body: bodyContent,
      redirect: "follow",
    });
    await response.json();
    if (!response.ok) {
      console.log("POST error on ", url);
      return "error";
    }
    storeUserModif(url, data);
    return "success";
  } catch (error) {
    return console.log("error", error);
  }
};

const storeUserModif = (url: string, data: string) => {
  if (url === "update_username") localStorage.setItem("userName", data);
  if (url === "update_email") localStorage.setItem("userEmail", data);
  if (url === "update_avatar") localStorage.setItem("userPicture", data);
};
