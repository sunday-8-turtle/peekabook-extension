init();

/*
 * Setup
 */
async function init() {
  // innitial url setup
  setUrl();
  setFormSaveHandler();
  setFormDeleteHandler();

  // initial date setup
  const remindDays = document.querySelector(".remind-days");
  const remindDate = document.querySelector(".remind-date");
  setDatePickerRange(remindDate);

  // reactive date change from "days"
  remindDays.addEventListener("click", setRemindDate(remindDate));
  // reactive date change from "date"
  remindDate.addEventListener("change", (e) => {
    const date = e.target.value;
  });

  function setUrl() {
    const { title, url } = await getCurrentTab();
    document.querySelector("#title").value = title;
  }

  function setFormSaveHandler() {
    const form = document.querySelector("form");
    form.addEventListener("formdata", onSubmit(url));
  }

  function setDatePickerRange(datePicker) {
    const today = formatDate(new Date());
    datePicker.min = today;
    datePicker.value = today;
  }
  function setFormDeleteHandler() {
    const deleteBtn = document.querySelector("#deleteBtn");
    deleteBtn.addEventListener("click", onClickDeleteBtn(url));
  }
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
 * Utilities
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

function cloneDate(date) {
  return new Date(date.valueOf());
}

function formatDate(date) {
  let year = date.getFullYear();

  let month = parseInt(date.getMonth() + 1);
  if (month < 10) month = "0" + month;

  let day = parseInt(date.getDate());
  if (day < 10) day = "0" + day;

  return `${year}-${month}-${day}`;
}

function setRemindDate(target) {
  return function (e) {
    const today = new Date();
    const daysFromToday = e.target.value;
    today.setDate(today.getDate() + parseInt(daysFromToday));

    target.value = formatDate(today);
  };
}
