import { authContentHeader } from "./headers";

export const getOtherUser = (otherUsername: number) => {
  let body = JSON.stringify({
    otherId: otherUsername,
  });
  return fetchGetOtherUser("get_user", body);
};

const fetchGetOtherUser = async (url: string, body: any) => {
  let fetchUrl = process.env.REACT_APP_BACKEND_URL + "/users/" + url;
  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: authContentHeader(),
      body: body,
      redirect: "follow",
    });
    const result_1 = await response.json();
    if (!response.ok) return "error";
    return result_1;
  } catch (error) {
    return console.log("error", error);
  }
};
