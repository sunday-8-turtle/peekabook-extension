chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let ogDescription = "";
  let ogContentImage = "";
  let ogIconImage = "";

  if (document.querySelector("meta[property='og:description']")) {
    ogDescription = document
      .querySelector("meta[property='og:description']")
      .getAttribute("content");
  }

  if (document.querySelector("meta[property~='og:image']")) {
    ogContentImage = document
      .querySelector("meta[property~='og:image']")
      .getAttribute("content");
  }

  if (document.querySelector("link[rel*='icon']")) {
    ogIconImage = document
      .querySelector("link[rel*='icon']")
      .getAttribute("href");
  }

  if (request.greeting === "hello")
    sendResponse({
      type: "og",
      desc: ogDescription,
      ogContentImage: ogContentImage,
      ogIconImage: ogIconImage,
    });
});
