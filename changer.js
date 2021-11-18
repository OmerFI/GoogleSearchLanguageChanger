const getActiveTab = () => {
  return browser.tabs.query({ active: true, currentWindow: true });
};

main = document.querySelector("main");
if (main) {
  main.addEventListener("click", (e) => {
    if (e.target.nodeName === "BUTTON") {
      type = e.target.dataset.type;
      language = e.target.dataset.language;

      browser.tabs
        .executeScript({
          code: `update(type="${type}", lang="${language}")`,
        })
        .then(() => {});
    }
  });
} else {
  console.error("main is null");
}
