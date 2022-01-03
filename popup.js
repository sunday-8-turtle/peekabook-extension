init();

/**
 * Setup
 */
async function init() {
  const { title, url } = await getCurrentTab();
  document.querySelector("#title").value = title;

  const form = document.querySelector("form");
  form.addEventListener("formdata", onSubmit(url));

  const deleteBtn = document.querySelector("#deleteBtn");
  deleteBtn.addEventListener("click", onClickDeleteBtn(url));
}

/*
 * Event Handlers
 */
function onSubmit(url) {
  return function (e) {
    const formData = e.formData;

    const clenaedData = {};
    for (const pair of formData.entries()) {
      clenaedData[pair[0]] = pair[1];
    }

    saveData(url, clenaedData);
  };
}

function onClickDeleteBtn(url) {
  return function () {
    deleteData(url);
  };
}

/*
 * Chrome APIs
 */
async function getCurrentTab() {
  const tab = await chrome.tabs.query({ currentWindow: true, active: true });
  return tab[0];
}

/*
 * LocalStorage Utility Functions
 */
function saveData(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

function deleteData(key) {
  window.localStorage.removeItem(key);
}
