async function sameFile(file, file2) {
  if (file.url && file2.url) {
    return (file.url === file2.url);
  }
  if (file.blob && file2.blob) {
    if (typeof file.blob === "string" && typeof file2.blob === "string") {
      return (file.blob === file2.blob);
    }
    else if (typeof window !== "undefined" && typeof window.Blob !== "undefined") {
      const { default: blobCompare } = await import("blob-compare");
      return blobCompare.isEqual(file.blob, file2.blob);
    } else {
      const { Buffer } = await import("buffer");
      const buffer1 = Buffer.from(await file.blob.arrayBuffer());
      const buffer2 = Buffer.from(await file2.blob.arrayBuffer());
      return buffer1.equals(buffer2);
    }
  }
  return false;
}

function updateFile(object, fileId, fileId2) {
  if (object?.file === fileId2) {
    object.file = fileId;
  }
}

async function compactFilesInView(doc) {
  doc.files = { ...doc.files };
  const currentFiles = Object.values(doc.files);
  for (let i = 0; i < currentFiles.length - 1; i++) {
    for (let j = i + 1; j < currentFiles.length; j++) {
      if (await sameFile(currentFiles[i], currentFiles[j])) {
        for (const dataset of Object.values(doc.datasets)) {
          updateFile(dataset, currentFiles[i].id, currentFiles[j].id);
        }
        for (const tree of Object.values(doc.trees)) {
          updateFile(tree, currentFiles[i].id, currentFiles[j].id);
        }
        for (const map of Object.values(doc.maps)) {
          updateFile(map.geodata, currentFiles[i].id, currentFiles[j].id);
        }
        for (const network of Object.values(doc.networks)) {
          updateFile(network, currentFiles[i].id, currentFiles[j].id);
        }

        delete doc.files[currentFiles[j].id];
        currentFiles.splice(j, 1);
        j -= 1; // Adjust index since we removed an element
      }
    }
  }
}

export async function compactMrDocument(doc) {
  await compactFilesInView(doc);
  doc.views = [ ...doc.views ];
  for (const view of doc.views) {
    await compactFilesInView(view);
  }
}
