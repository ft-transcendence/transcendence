import { authContentHeader } from "./headers";

export const getGameStats = (otherUsername: number) => {
  let body = JSON.stringify({
    otherId: otherUsername,
  });
  return fetGameStats("get_game_history", body);
};

const fetGameStats = async (url: string, body: any) => {
  let fetchUrl = process.env.REACT_APP_BACKEND_URL + "/users/" + url;
  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: authContentHeader(),
      body: body,
      redirect: "follow",
    });
    const result_1 = await response.json();
    if (!response.ok) {
      console.log("POST error on ", url);
      return "error";
    }
    return Object.assign(result_1);
  } catch (error) {
    return console.log("error", error);
  }
};