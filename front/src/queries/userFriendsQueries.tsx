export const addFriendQuery = (friendId: number) => {
  let body = JSON.stringify({
    otherId: friendId,
  });
  return fetchGet("add_friend", authFileHeader, body);
};

export const removeFriendQuery = (friendId: number) => {
  let body = JSON.stringify({
    otherId: friendId,
  });
  return fetchGet("rm_friend", authFileHeader, body);
};

export const blockUserQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("block_user", authFileHeader, body);
};

const authFileHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  return myHeaders;
};

const fetchGet = async (url: string, header: any, body: any) => {
  let fetchUrl = "http://localhost:4000/users/" + url;
  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: header(),
      body: body,
      redirect: "follow",
    });
    const result_1 = await response.json();
    console.log("result: ", result_1);
  } catch (error) {
    return console.log("error", error);
  }
};
