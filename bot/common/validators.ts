// Validate name
export const isValidName = (name: string) =>
  /^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/.test(name.trim());
