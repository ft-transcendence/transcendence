import { authHeader } from "./headers";

export const getUser = (otherUsername: string) => {
  let body = JSON.stringify({
    otherUsername: otherUsername,
  });
  return fetchGetOtherUser("add_friend", authHeader, body);
};

const fetchGetOtherUser = async (url: string, callback: any) => {
  let fetchUrl = "http://localhost:4000/users/" + url;
  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: authHeader(),
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