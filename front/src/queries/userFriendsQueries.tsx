export const addFriendQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("add_friend", authFileHeader, body);
};

export const removeFriendQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("rm_friend", authFileHeader, body);
};

export const blockUserQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("block_user", authFileHeader, body);
};

export const unblockUserQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  console.log("otherId: ", otherId);
  return fetchGet("unblock_user", authFileHeader, body);
};

export const cancelInviteQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("cancel_invite", authFileHeader, body);
};

export const denyInviteQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("deny_invite", authFileHeader, body);
};

const authFileHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  return myHeaders;
};

const fetchGet = async (url: string, header: any, body: any) => {
  let fetchUrl = process.env.REACT_APP_BACKEND_URL + "/users/" + url;
  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: header(),
      body: body,
      redirect: "follow",
    });
    await response;
    if (!response.ok) {
      console.log("POST error on ", url);
      return "error";
    }
    return "success";
  } catch (error) {
    return console.log("error", error);
  }
};
