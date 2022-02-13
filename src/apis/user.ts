import { getToken } from "./extension";

async function getUser() {
  const token = await getToken();

  const headers = {
    Authorization: token,
  };
  const res = await fetch(`${process.env.API_BASE_URL}/user`, {
    method: "GET",
    headers,
  });
  const responseData = res.json();
  return responseData;
}

export { getUser };
