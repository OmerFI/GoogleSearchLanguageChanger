//#region Utils
const getAbbreviation = (lang) => {
  const abbreviationList = {
    english: "en",
    turkish: "tr",
  };

  return abbreviationList[lang];
};

const getSettingsForActiveTab = () => {
  return { active: true, currentWindow: true };
};
//#endregion

//#region Main
let main = document.querySelector("main");
if (main) {
  //#region Set Language Specific Things
  let elementsToChange = document.querySelectorAll("[data-i18n]");
  elementsToChange.forEach((element) => {
    element.textContent = chrome.i18n.getMessage(element.dataset.i18n);
  });
  //#endregion

  //#region Add event listeners
  let languageButtons = document.querySelectorAll(".button-container > button");
  main.addEventListener("click", async (e) => {
    if (e.target.nodeName === "BUTTON") {
      type = e.target.dataset.type;
      language = e.target.dataset.language;

      Array.from(languageButtons).forEach((languageButton) => {
        switch (languageButton.dataset.type) {
          case type:
            if (language === languageButton.dataset.language) {
              languageButton.classList.add("active");
              languageButton.classList.remove("inactive");
            } else {
              languageButton.classList.add("inactive");
              languageButton.classList.remove("active");
            }
            break;
          default:
            break;
        }
      });

      // https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#executing-arbitrary-strings
      async function getCurrentTab() {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
      }
      let tab = await getCurrentTab();

      function doUpdate(givenType, givenLanguage) {
        update((type = `${givenType}`), (lang = `${givenLanguage}`));
      }

      chrome.scripting.executeScript({
        // code: `update(type="${type}", lang="${language}")`,
        target: { tabId: tab.id },
        func: doUpdate,
        args: [type, language],
      });
    } else if (e.target.nodeName === "I") {
      let type = e.target.dataset.type;
      let replacedType = type.replace("reset-", "");
      Array.from(languageButtons).forEach((languageButton) => {
        switch (languageButton.dataset.type) {
          case replacedType:
            languageButton.classList.add("inactive");
            languageButton.classList.remove("active");
            break;
          default:
            break;
        }
      });

      // https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#executing-arbitrary-strings
      async function getCurrentTab() {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
      }
      let tab = await getCurrentTab();

      function doUpdate(givenType) {
        update((type = `${givenType}`));
      }

      chrome.scripting.executeScript({
        // code: `update(type="${type}")`,
        target: { tabId: tab.id },
        func: doUpdate,
        args: [type],
      });
    }
  });
  //#endregion

  //#region Set active/inactive classes
  function setActiveAndInactiveClasses() {
    let languageButtons = document.querySelectorAll(
      ".button-container > button"
    );

    Array.from(languageButtons).forEach((languageButton) => {
      let language = getAbbreviation(languageButton.dataset.language);
      let type = languageButton.dataset.type;

      let url, urlParams;

      chrome.tabs.query(getSettingsForActiveTab(), function (tabs) {
        url = new URL(tabs[0].url);

        urlParams = new URLSearchParams(url.search);

        let hl = urlParams.get("hl");
        let lr = urlParams.get("lr");

        if (type == "interface") {
          if (hl === language) {
            languageButton.classList.add("active");
            languageButton.classList.remove("inactive");
          } else {
            languageButton.classList.add("inactive");
            languageButton.classList.remove("active");
          }
        } else if (type == "specified-language") {
          if (lr && lr.replace("lang_", "") === language) {
            languageButton.classList.add("active");
            languageButton.classList.remove("inactive");
          } else {
            languageButton.classList.add("inactive");
            languageButton.classList.remove("active");
          }
        } else {
          console.warn("Unknown type");
        }
      });
    });
  }

  setActiveAndInactiveClasses();
  //#endregion
} else {
  console.error("main is null");
}
//#endregion
