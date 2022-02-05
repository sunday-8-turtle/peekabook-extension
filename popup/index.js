init();

/*
 * Setup
 */
async function init() {
  const { title, url } = await getCurrentTab();
  if (isBookmarkDuplicate(url)) toggleDuplicate();

  setTitleByUrl(title);
  setFormSaveHandler(url);
  setFormDeleteHandler(url);
  setDatePickerRange();
  setReactiveDaysHandler();
  setReactiveDateHandler();
  setTagHandler();

  async function setTitleByUrl(title) {
    document.querySelector("#title-input").value = title;
  }

  function setFormSaveHandler() {
    const form = document.querySelector("form");
    form.addEventListener("formdata", onSubmit(url));
  }

  function setFormDeleteHandler() {
    const deleteBtn = document.querySelector("#deleteBtn");
    deleteBtn.addEventListener("click", onClickDeleteBtn(url));
  }

  function setDatePickerRange() {
    const datePicker = document.querySelector("#remind-date");
    const today = formatDate(new Date());
    datePicker.min = today;
    datePicker.value = formatDate(getRemindDate());
  }

  function setReactiveDaysHandler() {
    const remindDays = document.querySelector("#remind-days");
    const remindDate = document.querySelector("#remind-date");
    remindDays.addEventListener("change", setRemindDate(remindDate));
  }

  function setReactiveDateHandler() {
    const remindDays = document.querySelector("#remind-days");
    const remindDate = document.querySelector("#remind-date");
    remindDate.addEventListener("change", (e) => {
      console.log(getRemindDays());
      remindDays.value = getRemindDays();
    });
  }

  function setTagHandler() {
    const tagInput = document.querySelector("#tag-input");
    tagInput.addEventListener("keydown", (e) => {
      if (e.isComposing || e.key !== "Enter") return;
      e.preventDefault();

      const tagName = e.target.value;
      const newTag = document.createElement("li");
      newTag.classList.add("tag");
      newTag.innerText = tagName;

      const targetElement = document.querySelector(".tag-input-box");
      targetElement.insertAdjacentElement("beforebegin", newTag);

      tagInput.value = "";
    });
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
    closePopup();
    alert("저장되었습니다!");
  };
}

function onClickDeleteBtn(url) {
  return function () {
    deleteData(url);
    closePopup();
    alert("삭제되었습니다!");
  };
}

/*
 * Chrome APIs
 */
function closePopup() {
  window.close();
}

async function getCurrentTab() {
  const tab = await chrome.tabs.query({ currentWindow: true, active: true });
  return tab[0];
}

/*
 * Utilities
 */
function isBookmarkDuplicate(url) {
  // (todo) send a request to the API server
  if (loadData(url)) return true;
  return false;
}

function toggleDuplicate() {
  const alert = document.querySelector("div.alert");
  alert.classList.toggle("hidden");
}

function saveData(key, value) {
  // (todo) send a request to the API server
  window.localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key) {
  // (todo) send a request to the API server
  return JSON.parse(window.localStorage.getItem(key));
}

function deleteData(key) {
  // (todo) send a request to the API server
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
    target.value = formatDate(getRemindDate());
  };
}

function getRemindDate() {
  const today = new Date();
  const daysFromToday = document.querySelector("#remind-days").value;
  today.setDate(today.getDate() + parseInt(daysFromToday));

  return cloneDate(today);
}

function getRemindDays() {
  const today = new Date();
  const d = new Date(document.querySelector("#remind-date").value);

  const utcToday = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    today.getHours(),
    today.getMinutes(),
    today.getSeconds(),
    today.getMilliseconds()
  );
  const utcRemindDate = Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds()
  );

  return Math.floor((utcRemindDate - utcToday) / 86400000);
}
