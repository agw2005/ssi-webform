export const sum = (n: number) => {
  let result = 0;
  for (let i = n; i > 0; i--) {
    result += i;
  }
  return result;
};
