import { getToken } from "./extension";
import { bookmarkRequest } from "../types/bookmark.types";

async function createBookmark(data: bookmarkRequest) {
  const token = await getToken();
  const headers = {
    Authorization: token,
  };

  const res = await fetch(`${process.env.API_BASE_URL}/bookmark/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  const responseData = res.json();

  return responseData;
}

export { createBookmark };
