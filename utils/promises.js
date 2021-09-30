export function promiseTimeout(time) {
  return new Promise((resolve) => {
    setTimeout(
      resolve,
      time,
    );
  });
}
