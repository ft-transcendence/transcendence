import { authContentHeader } from "./headers";

export const getUserFriends = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("get_friends", authContentHeader, body);
};

export const addFriendQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("add_friend", authContentHeader, body);
};

export const removeFriendQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("rm_friend", authContentHeader, body);
};

export const blockUserQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("block_user", authContentHeader, body);
};

export const unblockUserQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("unblock_user", authContentHeader, body);
};

export const cancelInviteQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("cancel_invite", authContentHeader, body);
};

export const denyInviteQuery = (otherId: number) => {
  let body = JSON.stringify({
    otherId: otherId,
  });
  return fetchGet("deny_invite", authContentHeader, body);
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
    const result = await response.json();
    if (!response.ok) {
      console.log("POST error on ", url);
      return "error";
    }
    return result;
  } catch (error) {
    return console.log("error", error);
  }
};
