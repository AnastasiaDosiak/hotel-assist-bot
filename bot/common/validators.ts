// Validate name
export const isValidName = (name: string) =>
  /^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/.test(name.trim());

// Validate phone number
export const isValidPhoneNumber = (phone: string) =>
  /^\+?\d{10,15}$/.test(phone.trim());
