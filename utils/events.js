import postal from "postal";

const channel = postal.channel();

export function subscribe(event, callback) {
  const subscription = channel.subscribe(
    event,
    callback,
  );

  return () => subscription.unsubscribe();
}

export function publish(event, data) {
  return channel.publish(
    event,
    data,
  );
}
