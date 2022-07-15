export const updateUsernameQuery = (username: string) => {
  var raw = JSON.stringify({
    username: username,
  });
  fetchPost(raw, "update_username");
};

export const updateEmailQuery = (email: string) => {
  var raw = JSON.stringify({
    email: email,
  });
  fetchPost(raw, "update_email");
};

const authHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  // console.log("token", token);
  return myHeaders;
};

const fetchPost = (raw: string, url: string) => {
  let fetchUrl = "http://localhost:4000/users/" + url;
  fetch(fetchUrl, {
    method: "POST",
    headers: authHeader(),
    body: raw,
    redirect: "follow",
  })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .then(() => console.log("user update"))
    .catch((error) => console.log("error", error));
};
