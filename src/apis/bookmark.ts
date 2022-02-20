import { getToken } from "./extension";
import { bookmarkRequest } from "../types/bookmark.types";

async function createBookmark(data: bookmarkRequest) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };

  const res = await fetch(`${process.env.API_BASE_URL}/bookmark`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  const responseData = res.json();

  return responseData;
}

/**
 * page & size must be set optinally.
 * requested to API devs.
 * or we need a dedicated endpoint for dueplicate check.
 */
async function verifyDuplication(url: string) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };

  const requestUrl = new URL(
    `${process.env.API_BASE_URL}/bookmark/duplication`
  );

  const res = await fetch(requestUrl.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify({ url }),
  });
  const responseData = res.json();

  return responseData;
}

export { createBookmark, verifyDuplication };
