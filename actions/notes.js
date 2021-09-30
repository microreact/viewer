export function addNote(paneId, title) {
  return {
    type: "MICROREACT VIEWER/ADD NOTE",
    payload: {
      paneId,
      title: title || "Note",
    },
  };
}

export function removeNote(paneId) {
  return {
    delay: true,
    group: `${paneId}/remove`,
    label: "Note: Remove Note",
    payload: {
      paneId,
    },
    type: "MICROREACT VIEWER/REMOVE NOTE",
  };
}

export function update(noteId, key, value) {
  return {
    delay: true,
    group: `${noteId}/${key}`,
    label:
      (key === "source") ? "Note: Update note" :
        undefined,
    type: "MICROREACT VIEWER/UPDATE NOTE",
    noteId,
    payload: { [key]: value },
  };
}
