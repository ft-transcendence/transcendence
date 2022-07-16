export const updateAvatarQuery = (file: any) => {
  var formdata = new FormData();
  formdata.append("avatar", file.files[0], "avatar.jpeg");

  fetchPost(formdata, "update_avatar", authFileHeader);
};

export const updateUsernameQuery = (username: string) => {
  var raw = JSON.stringify({
    username: username,
  });
  fetchPost(raw, "update_username", authRawHeader);
};

export const updateEmailQuery = (email: string) => {
  var raw = JSON.stringify({
    email: email,
  });
  fetchPost(raw, "update_email", authRawHeader);
};

const authRawHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  return myHeaders;
};

const authFileHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  return myHeaders;
};

const fetchPost = (bodyContent: any, url: string, header: any) => {
  let fetchUrl = "http://localhost:4000/users/" + url;
  fetch(fetchUrl, {
    method: "POST",
    headers: header(),
    body: bodyContent,
    redirect: "follow",
  })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .then(() => console.log("user update"))
    .catch((error) => console.log("error", error));
};
