// eslint-disable-next-line @typescript-eslint/ban-types
export const throttle = (func: (...args: any) => any, delay: number) => {
  let interval: ReturnType<typeof setTimeout> | null;
  let calledWIth: Array<any> | null;
  let res: ReturnType<typeof func>;
  return function (...args: Array<any>) {
    calledWIth = args;
    if (!interval) {
      res = func.apply(this, calledWIth);
      calledWIth = null;
      interval = setInterval(() => {
        if (!calledWIth) {
          clearInterval(interval);
          interval = null;
          return;
        }
        res = func.apply(this, calledWIth);
        calledWIth = null;
      }, delay);
    }
    return res;
  };
};
