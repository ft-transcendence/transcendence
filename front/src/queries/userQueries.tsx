export const getUserFriends = () => {
  return fetchGet("get_friends", storeFriendsInfo);
};

export const getUserBlocked = () => {
  return fetchGet("get_blocked", storeFriendsInfo);
};

export const getUserPending = () => {
  return fetchGet("get_pending", storeFriendsInfo);
};

export const getUserData = () => {
  return fetchGet("me", storeUserInfo);
};

export const getLeaderBoard = () => {
  return fetchGet("get_leaderboard", storeLeaderBoardInfo);
}

export const authFileHeader = () => {
  let token = "Bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  return myHeaders;
};

const fetchGet = async (url: string, callback: any) => {
  let fetchUrl = "http://localhost:4000/users/" + url;
  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: authFileHeader(),
      body: null,
      redirect: "follow",
    });
    const result_1 = await response.json();
    if (!response.ok) {
      console.log("POST error on ", url);
      return "error";
    }
    return callback(result_1);
  } catch (error) {
    return console.log("error", error);
  }
};

export const storeUserInfo = (result: any) => {
  localStorage.setItem("userID", result.id);
  localStorage.setItem("userName", result.username);
  localStorage.setItem("userEmail", result.email);
  localStorage.setItem("userPicture", result.avatar);
  localStorage.setItem("userGamesWon", result.gamesWon);
  localStorage.setItem("userGamesLost", result.gamesLost);
  localStorage.setItem("userGamesPlayed", result.gamesPlayed);
  localStorage.setItem("userAuth", result.twoFA);
};

export const storeFriendsInfo = (result: any) => {
  return result;
};

export const storeLeaderBoardInfo = (result: any) => {
  // console.log("store leaderboard:::", result)
  localStorage.setItem("leaderBoard", JSON.stringify(result));
}