export const addFile = (fileDescriptor) => ({
  type: "MICROREACT VIEWER/ADD FILE",
  payload: {
    _content: fileDescriptor._content,
    blob: fileDescriptor.blob,
    format: fileDescriptor.format,
    hash: fileDescriptor.hash,
    id: fileDescriptor.id,
    name: fileDescriptor.name,
    type: fileDescriptor.type,
    url: fileDescriptor.url,
    size: fileDescriptor.size,
  },
});

export function setFileContent(file) {
  return {
    payload: file,
    type: "MICROREACT VIEWER/UPDATE FILE",
  };
}

export const removeFile = (fileId) => {
  return {
    type: "MICROREACT VIEWER/REMOVE FILE",
    label: "Project: Remove file",
    payload: fileId,
  };
};

export function updateFile(file) {
  return {
    label: "Project: Update file",
    payload: file,
    type: "MICROREACT VIEWER/UPDATE FILE",
  };
}
