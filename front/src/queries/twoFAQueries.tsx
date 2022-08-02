export const twoFAGenerate = () => {
  return fetchPost(null, "generate");
};

export const twoFAAuth = (twoFAcode: string, email: string) => {
  let raw = JSON.stringify({
    username: email,
    twoFAcode: twoFAcode,
  });
  console.log('raw', raw);
  return fetchValid(raw, "authenticate");
};

export const twoFAOn = (code: string) => {
  let raw = JSON.stringify({
    twoFAcode: code,
  });
  return fetchPost(raw, "turn-on");
};

const authRawHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  return myHeaders;
};

const fetchPost = async (body: any, url: string) => {
  let fetchUrl = "http://localhost:4000/auth/2fa/" + url;

  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: authRawHeader(),
      body: body,
      redirect: "follow",
    });
    const result_1 = await response.json();
    return result_1;
  } catch (error) {
    return console.log("error", error);
  }
};

const fetchValid = async (body: any, url: string) => {
  let fetchUrl = "http://localhost:4000/auth/2fa/" + url;
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  try {
    console.log('body is', body);
    
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    });
    const result_1 = await response.json();
    return result_1;
  } catch (error) {
    return console.log("error", error);
  }
};