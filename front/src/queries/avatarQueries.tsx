const authFileHeader = () => {
  let token = "bearer " + localStorage.getItem("userToken");
  let myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  return myHeaders;
};

export const uploadAvatarQuery = (fileInput:any) => {
  var formdata = new FormData();

  formdata.append(
    "avatar",
    fileInput,
    "name.png"
  );
  return fetchPost("POST", formdata, "avatar");
};

const fetchPost = async (method: string, formdata: any, url: string) => {
  let fetchUrl = "http://localhost:4000/upload/" + url;

  try {
    const response = await fetch(fetchUrl, {
      method: method,
      headers: authFileHeader(),
      body: formdata,
      redirect: "follow",
    });
    const result_1 = await response.json();
    if (!response.ok) {
      console.log("POST error on ", url);
      return "error: " + url;
    }
  } catch (error) {
    return console.log("error", error);
  }
};
