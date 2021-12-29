//#region Utils
const getAbbreviation = (lang) => {
  const abbreviationList = {
    english: "en",
    turkish: "tr",
  };

  return abbreviationList[lang];
};

const getActiveTab = () => {
  return browser.tabs.query({ active: true, currentWindow: true });
};
//#endregion

//#region Main
let main = document.querySelector("main");
if (main) {
  //#region Add event listeners
  let languageButtons = document.querySelectorAll(".button-container > button");
  main.addEventListener("click", (e) => {
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

      browser.tabs
        .executeScript({
          code: `update(type="${type}", lang="${language}")`,
        })
        .then(() => {});
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

      browser.tabs
        .executeScript({
          code: `update(type="${type}")`,
        })
        .then(() => {});
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
      getActiveTab().then((tabs) => {
        url = new URL(tabs[0].url);

        urlParams = new URLSearchParams(url.search);

        let hl = urlParams.get("hl");
        let lr = urlParams.get("lr");

        switch (type) {
          case "interface":
            if (hl === language) {
              languageButton.classList.add("active");
              languageButton.classList.remove("inactive");
            } else {
              languageButton.classList.add("inactive");
              languageButton.classList.remove("active");
            }
            break;
          case "specified-language":
            if (lr && lr.replace("lang_", "") === language) {
              languageButton.classList.add("active");
              languageButton.classList.remove("inactive");
            } else {
              languageButton.classList.add("inactive");
              languageButton.classList.remove("active");
            }
          default:
            console.error("Unknown type");
            break;
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
