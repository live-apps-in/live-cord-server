////Generate Random Numbers
export const random_numbers = (size: number): number => {
  return Math.floor(
    Math.pow(10, size - 1) +
      Math.random() * (Math.pow(10, size) - Math.pow(10, size - 1) - 1),
  );
};
