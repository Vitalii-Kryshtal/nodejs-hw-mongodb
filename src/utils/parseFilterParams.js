const parseContactType = (contactType) => {
  const isString = typeof contactType === "string";
  if (!isString) return;
  const isContactType = (contactType) =>
    ["home", "work", "personal"].includes(contactType);

  if (isContactType(contactType)) return contactType;
};

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite !== "string") return;

  const isBooleanType = ["true", "false"].includes(isFavourite.toLowerCase());

  if (!isBooleanType) return;

  return JSON.parse(isFavourite.toLowerCase());
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
