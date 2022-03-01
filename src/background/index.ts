import { verifyDuplication } from "../apis/bookmark";

/**
 * 아이콘 활성 관련 이벤트
 */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "activate-icon") {
    toggleIcon("16x16_활성.png");
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "popup") {
    port.onDisconnect.addListener(function () {
      toggleIcon("16x16_비활성.png");
    });
  }
});

function toggleIcon(iconPath) {
  chrome.action.setIcon({
    path: {
      "16": iconPath,
    },
  });
}

/**
 * 웹 앱에서 토큰 전달받아서 저장
 */
chrome.runtime.onMessageExternal.addListener(function (message) {
  const token = message.token;
  console.log(message, "왔어요???");
  chrome.storage.sync.set({ token });
});

/**
 * duplication check
 */
// async function checkIfDuplicated(url) {
//   const res = await verifyDuplication(url);
//   const isDuplicated = res.data.duplication;
//   if (!isDuplicated) return;

//   const message = "이미 즐겨찾기가 완료된 페이지입니다.";
//   const annotation = url;

//   console.log(res);
// }
