export const delayCall = <Args extends Array<any> = []>(
  callback: (...args: Args) => void,
  delayMs = 500,
) => {
  // it is not number when callback not recieve some arguments.
  // but it is work.
  let timeout: number | null = null;
  const wrappedCallback = (...args: Args) => {
    callback(...args);
    timeout = null;
  };
  const handler = (...args: Args) => {
    if (timeout != null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(wrappedCallback, delayMs, ...args);
  };
  return handler;
};
