export const getUserFriends = () => {
  return fetchGet("get_friends", authFileHeader, storeFriendsInfo);
};

export const getUserBlocked = () => {
  return fetchGet("get_blocked", authFileHeader, storeFriendsInfo);
};

export const getUserPending = () => {
  return fetchGet("get_pending", authFileHeader, storeFriendsInfo);
};

export const getUserData = () => {
  return fetchGet("me", authFileHeader, storeUserInfo);
};

const authFileHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  return myHeaders;
};

const fetchGet = async (url: string, header: any, callback: any) => {
  let fetchUrl = "http://localhost:4000/users/" + url;
  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      //headers: header(),
      credentials: "same-origin",
      mode: "cors",
      body: null,
      redirect: "follow",
    });
    const result_1 = await response.json();
    return callback(result_1);
  } catch (error) {
    return console.log("error", error);
  }
};

export const storeUserInfo = (result: any) => {
  localStorage.setItem("userID", result.id);
  localStorage.setItem("userName", result.username);
  localStorage.setItem("userEmail", "back sends email");
  localStorage.setItem("userPicture", result.picture);
  localStorage.setItem("userGamesWon", result.gamesWon);
  localStorage.setItem("userGamesLost", result.gamesLost);
  localStorage.setItem("userGamesPlayed", result.gamesPlayed);
  // localStorage.setItem("userAuth", result.twoFA);SET 2FA STATUS IN BACK
};

export const storeFriendsInfo = (result: any) => {
  return result;
  // add blocked users later
};
