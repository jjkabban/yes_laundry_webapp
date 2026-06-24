export const validatePhoneNumber = (value: string) => value.trim().length >= 10;
export const validatePassword = (value: string) => value.length >= 8;
export const validateEmail = (value: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
