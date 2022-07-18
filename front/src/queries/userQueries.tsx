export const getUserData = () => {
  fetchGet("me", authFileHeader);
};

const authFileHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  return myHeaders;
};

const fetchGet = (url: string, header: any) => {
  let fetchUrl = "http://localhost:4000/users/" + url;
  fetch(fetchUrl, {
    method: "GET",
    headers: header(),
    body: null,
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((result) => storeUserInfo(result))
    .catch((error) => console.log("error", error));
};

export const storeUserInfo = (result: any) => {
  localStorage.setItem("userName", result.username);
  localStorage.setItem("userEmail", "back sends email");
  localStorage.setItem("userPicture", result.picture);
  localStorage.setItem("userGamesWon", result.gamesWon);
  localStorage.setItem("userGamesLost", result.gamesLost);
  localStorage.setItem("userGamesPlayed", result.gamesPlayed);
};
