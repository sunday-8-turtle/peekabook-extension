const ogDescription = document
  .querySelector("meta[property='og:description']")
  .getAttribute("content");

const ogImage = document
  .querySelector("link[rel~='icon']")
  .getAttribute("href");

chrome.runtime.onConnect.addListener(() => {
  chrome.runtime.sendMessage({
    type: "og",
    desc: ogDescription,
    image: ogImage,
  });
});
