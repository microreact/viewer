const dataFileUrlSelector = (state) => {
  const url = Object.values(state.files).find((x) => x.type === "data" && !!x.url)?.url;
  if (url && url.startsWith("/api/files/")) {
    return `https://beta.microreact.org${url}`;
  }
  else {
    return url;
  }
};

export default dataFileUrlSelector;
