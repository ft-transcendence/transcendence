export const twoFAGenerate = () => {
  return fetchPost("2fa/generate");
};

const authRawHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  return myHeaders;
};

const fetchPost = async (url: string) => {
  let fetchUrl = "http://localhost:4000/auth/" + url;

  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: authRawHeader(),
      body: null,
      redirect: "follow",
    });
    const result_1 = await response.json();
    return result_1;
  } catch (error) {
    return console.log("error", error);
  }
};

export const twoFAValidate = async (code: string) => {
  let fetchUrl = "http://localhost:4000/auth/2fa/turn-on";

  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: authRawHeader(),
      body: JSON.stringify({ twoFAcode: code, username: "sshakya@student.42.fr" }),
      redirect: "follow",
    });
    const result_1 = await response.json();
    return result_1;
  } catch (error) {
    return console.log("error", error);
  }
}