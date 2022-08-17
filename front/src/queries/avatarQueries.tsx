const authFileHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  return myHeaders;
};

export const uploadAvatarQuery = (fileInput: any) => {
  var formdata = new FormData();

  formdata.append("avatar", fileInput, "name.png");
  return fetchAvatar("POST", formdata, authFileHeader(), "avatar");
};

export const getAvatarQuery = () => {
  return fetchAvatar("GET", null, authFileHeader(), "avatar");
};

export const getUserAvatarQuery = (otherId: number) => {
  let body = JSON.stringify({
    userId: otherId,
  });
  let header = authFileHeader();
  header.append("Content-Type", "application/json");
  return fetchAvatar("POST", body, header, "getavatar");
};

const fetchAvatar = async (
  method: string,
  body: any,
  header: any,
  url: string
) => {
  let fetchUrl = "http://localhost:4000/upload/" + url;

  let requestOptions: RequestInit | undefined;
  if (method === "POST")
    requestOptions = {
      method: method,
      headers: header,
      body: body,
      redirect: "follow",
    };
  else
    requestOptions = {
      method: method,
      headers: header,
      redirect: "follow",
    };

  try {
    const response = await fetch(fetchUrl, requestOptions);
    const result_1 = await response.blob();
    if (!response.ok) {
      console.log("POST error on ", url);
      return "error: " + url;
    }
    return result_1;
  } catch (error) {
    console.log("error", error);
  }
};
