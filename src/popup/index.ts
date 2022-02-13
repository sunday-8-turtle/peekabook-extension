import "./index.scss";
import { getUser } from "../apis/user";
import { createBookmark } from "../apis/bookmark";
import { bookmarkRequest } from "../types/bookmark.types";

init();

/*
 * Setup
 */
async function init() {
  const { title, url, id: tabId } = await getCurrentTab();

  triggerIconChange();
  checkIfLoggedIn();

  setUrl(url);
  setTitle(title);
  setDesc(tabId);
  setNotiHandler();
  setFormSaveHandler();
  setFormCancelHandler();
  setTagHandler();

  function setTitle(title) {
    (document.querySelector('input[name="title"]') as HTMLInputElement).value =
      title;
  }

  function setUrl(url) {
    (
      document.querySelector(
        "#bookmark-url-with-img > figcaption"
      ) as HTMLInputElement
    ).innerText = url;

    (document.querySelector("input[name='url']") as HTMLInputElement).value =
      url;
  }

  function setDesc(tabId) {
    chrome.tabs.connect(tabId);
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "og" && message.desc) {
        (
          document.querySelector(
            'textarea[name="description"]'
          ) as HTMLInputElement
        ).value = message.desc;

        const bookmarkImage = document.querySelector(
          "#bookmark-url-with-img > img"
        ) as HTMLImageElement;
        bookmarkImage.src = message.image;
        bookmarkImage.onerror = function () {
          this.src = "16x16_활성.png";
        };
      }
    });
  }

  function setNotiHandler() {
    // set noti date icon
    const notiDateSpan = document.querySelector(
      "#noti > span"
    ) as HTMLSpanElement;
    setNotiIcon(notiDateSpan);

    // dropdown select event
    const notiDropdown = document.querySelector(
      "#noti-option-dropdown"
    ) as HTMLUListElement;
    const notiDropdownItemList = notiDropdown.querySelectorAll("li");
    notiDropdownItemList.forEach((notiItem) => {
      notiItem.addEventListener("click", updateNotiDate(notiDateSpan));
    });

    // dropdown close event
    window.addEventListener("click", toggleNotiDropdown(notiDropdown));

    //dropdown open event
    const notiBtn = document.querySelector("#noti") as HTMLButtonElement;
    notiBtn.addEventListener("click", onClickNoti(notiDropdown));

    function toggleNotiDropdown(notiDropdown) {
      return function () {
        notiDropdown.classList.remove("show");
      };
    }

    function updateNotiDate(notiDateSpan) {
      return function (e) {
        const selectedNotiDate = e.target.innerText;
        notiDateSpan.dataset.notiDate = selectedNotiDate;
        notiDateSpan.innerText = selectedNotiDate;
        setNotiIcon(notiDateSpan);
      };
    }

    function setNotiIcon(notiDateSpan) {
      const notiImg = document.querySelector("#noti > img") as HTMLImageElement;
      const notiDate = notiDateSpan.dataset.notiDate;

      let notiImgSrc = "bell.svg";
      let notiTextColor = "#868E96";
      if (notiDate === "끄기") {
        notiImgSrc = "bell-off.svg";
        notiTextColor = "#CED4DA";
      }
      notiImg.src = notiImgSrc;
      notiDateSpan.style.color = notiTextColor;
    }
  }

  function setFormSaveHandler() {
    const form = document.querySelector("form");
    form.addEventListener("submit", onSubmit());
  }

  function setFormCancelHandler() {
    const deleteBtn = document.querySelector("button[name='cancel']");
    deleteBtn.addEventListener("click", onClickCancelBtn());
  }

  function setTagHandler() {
    const tagInput = document.querySelector(
      'input[name="bookmark-tag"]'
    ) as HTMLInputElement;
    tagInput.addEventListener("keydown", onCreateTag(tagInput));
  }
}

/*
 * Event Handlers
 */
function onClickNoti(notiDropdown) {
  return function (e) {
    e.stopPropagation();
    notiDropdown.classList.add("show");
  };
}

function onSubmit() {
  return function (e) {
    e.preventDefault();

    const requestData: bookmarkRequest = {
      title: "",
      url: "",
      description: "",
      tags: [],
      notidate: "",
    };

    // add tag list to formdata
    const form = document.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);
    for (const entries of formData.entries()) {
      if (entries[0] === "bookmark-tag") continue;
      requestData[entries[0]] = entries[1];
    }

    const tagList = document.querySelectorAll("#tag-list > li");
    tagList.forEach((li) => {
      const tagName = li.querySelector("span").dataset.tagName;
      requestData.tags.push(tagName);
    });

    // add notidate
    const notidate = getFormattedRemindDate();
    requestData.notidate = notidate;

    createBookmark(requestData);
  };
}

function onClickCancelBtn() {
  return function () {
    closePopup();
  };
}

function onDeleteTag(newTag) {
  return function () {
    newTag.remove();
  };
}

function onCreateTag(tagInput) {
  return function (e) {
    // (important) the order matters here
    if (e.isComposing || e.key !== "Enter") return;
    e.preventDefault();

    const tagName = (e.target as HTMLInputElement).value;
    if (!tagName.trim()) return;

    const targetElement = document.querySelector("#tag-list") as HTMLElement;
    if (isDuplicated(tagName, targetElement)) return;

    const tagNameForDisplay = getTagNameForDisplay(tagName);
    const newTag = document.createElement("li");
    const newSpan = document.createElement("span");
    newSpan.innerText = tagNameForDisplay;
    newSpan.dataset.tagName = tagName;

    const deleteBtn = document.createElement("button");
    deleteBtn.addEventListener("click", onDeleteTag(newTag));
    deleteBtn.innerHTML = `<img src="icon-x.svg" alt="태그 삭제 아이콘">`;

    newTag.append(newSpan, deleteBtn);
    targetElement.append(newTag);

    tagInput.value = "";

    function isDuplicated(tagName, targetElement) {
      let result = false;
      const tagList = targetElement.querySelectorAll("li");
      tagList.forEach((tag) => {
        if (tagName === tag.querySelector("span").dataset.tagName) {
          result = true;
        }
      });
      return result;
    }

    function getTagNameForDisplay(tagName) {
      let tagNameForDisplay = tagName;
      if (tagNameForDisplay.length >= 8) {
        tagNameForDisplay = tagNameForDisplay.slice(0, 7) + "...";
      }
      return tagNameForDisplay;
    }
  };
}

/*
 * Chrome APIs
 */
async function checkIfLoggedIn() {
  chrome.storage.sync.get(["token"], async function (result) {
    const res = await getUser();
    if (!result.token || res.errorCode === "AUTH_INVALID_TOKEN") {
      chrome.tabs.create({
        active: true,
        url: process.env.VUE_APP_URL,
      });
    }
  });
}

function triggerIconChange() {
  chrome.runtime.sendMessage({ type: "activate-icon" });
  chrome.runtime.connect({ name: "popup" });
}

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
function cloneDate(date) {
  return new Date(date.valueOf());
}

function formatDate(date) {
  if (date == -1) return "";

  let year = date.getFullYear();

  let month = date.getMonth() + 1;
  if (month < 10) month = "0" + month.toString();

  let day = date.getDate();
  if (day < 10) day = "0" + day.toString();

  return `${year}-${month}-${day}`;
}

function getRemindDate() {
  const today = new Date();
  const daysFromToday = (
    document.querySelector("#noti > span") as HTMLInputElement
  ).dataset.notiDate;

  if (daysFromToday === "끄기") return -1;

  today.setDate(today.getDate() + parseInt(daysFromToday));
  return cloneDate(today);
}

function getFormattedRemindDate() {
  return formatDate(getRemindDate());
}

function getRemindDays() {
  const today = new Date();
  const d = new Date(
    (document.querySelector("#remind-date") as HTMLInputElement).value
  );

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
