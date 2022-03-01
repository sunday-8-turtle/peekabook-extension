let ogDescription = "";
let ogImage = "";

if (document.querySelector("meta[property='og:description']")) {
  ogDescription = document
    .querySelector("meta[property='og:description']")
    .getAttribute("content");
}

if (document.querySelector("link[rel~='icon']")) {
  ogImage = document.querySelector("link[rel~='icon']").getAttribute("href");
}

chrome.runtime.onConnect.addListener(() => {
  chrome.runtime.sendMessage({
    type: "og",
    desc: ogDescription,
    image: ogImage,
  });
});
