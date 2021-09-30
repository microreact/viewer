function selectText(element) {
  const doc = document;
  if (doc.body.createTextRange) {
    var range = document.body.createTextRange();
    range.moveToElementText(element);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

export function copyImage(dataUrl) {
  const img = document.createElement("img");
  img.src = dataUrl;

  const div = document.createElement("div");
  div.contentEditable = true;
  div.appendChild(img);
  document.body.appendChild(div);

  // do copy
  selectText(div);
  document.execCommand("Copy");
  // document.body.removeChild(div);
}
