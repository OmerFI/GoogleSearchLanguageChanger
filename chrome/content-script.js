const getAbbreviation = (lang) => {
  const abbreviationList = {
    english: "en",
    turkish: "tr",
  };

  return abbreviationList[lang];
};

const update = (type, lang) => {
  if (lang) {
    lang = lang.toLowerCase();
  }

  const urlParams = new URLSearchParams(window.location.search);

  switch (type) {
    case "interface":
      urlParams.set("hl", getAbbreviation(lang));
      break;
    case "specified-language":
      urlParams.set("lr", `lang_${getAbbreviation(lang)}`);
      break;
    case "reset-interface":
      urlParams.delete("hl");
      break;
    case "reset-specified-language":
      urlParams.delete("lr");
      break;
    default:
      console.error("Unknown type");
      return;
  }

  window.location.search = urlParams;
};
