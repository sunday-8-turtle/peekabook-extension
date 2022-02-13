async function getToken(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["token"], function (result) {
      resolve(result.token);
    });
  });
}

export { getToken };
