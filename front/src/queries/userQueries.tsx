export const getUserData = () => {
  return fetchGet("me", authFileHeader);
};

const authFileHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  return myHeaders;
};

const fetchGet = async (url: string, header: any) => {
  let fetchUrl = "http://localhost:4000/users/" + url;
  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: header(),
      body: null,
      redirect: "follow",
    });
    const result_1 = await response.json();
    return storeUserInfo(result_1);
  } catch (error) {
    return console.log("error", error);
  }
};

export const storeUserInfo = (result: any) => {
  localStorage.setItem("userName", result.username);
  localStorage.setItem("userEmail", "back sends email");
  localStorage.setItem("userPicture", result.picture);
  localStorage.setItem("userGamesWon", result.gamesWon);
  localStorage.setItem("userGamesLost", result.gamesLost);
  localStorage.setItem("userGamesPlayed", result.gamesPlayed);
};
