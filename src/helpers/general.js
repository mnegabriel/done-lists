export const uid = () => {
  const head = Date.now().toString(36);
  const tail = Math.random().toString(36);

  return head + tail;
};
