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
  main.addEventListener("click", (e) => {
    if (e.target.nodeName === "BUTTON") {
      type = e.target.dataset.type;
      language = e.target.dataset.language;

      browser.tabs
        .executeScript({
          code: `update(type="${type}", lang="${language}")`,
        })
        .then(() => {});
    } else if (e.target.nodeName === "I") {
      type = e.target.dataset.type;

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
            } else {
              languageButton.classList.add("inactive");
            }
            break;
          case "specified-language":
            if (lr && lr.replace("lang_", "") === language) {
              languageButton.classList.add("active");
            } else {
              languageButton.classList.add("inactive");
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
//#endregion main
