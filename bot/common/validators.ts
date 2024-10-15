// Validate name
export const isValidName = (name: string) =>
  /^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/.test(name.trim());

export const dateRegex = /\d{2}\/\d{2}\/\d{4}/;
