const capitalize = (str: string) => {
  const lowercased = str.toLowerCase();
  const capitalized = lowercased.replace(
    /\b[a-z]/g,
    (char) => char.toUpperCase(),
  );
  return capitalized;
};

export default capitalize;
