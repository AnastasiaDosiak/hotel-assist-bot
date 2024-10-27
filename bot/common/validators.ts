// Validate name
export const isValidName = (name: string) =>
  /^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/.test(name.trim());

export const dateRegex = /\d{2}\/\d{2}\/\d{4}/;

export const isValidPhoneNumber = (phoneNumber: string) =>
  /^380\d{9}$/.test(phoneNumber.trim());
