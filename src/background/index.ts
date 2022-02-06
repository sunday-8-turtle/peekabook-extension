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
