export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isNonEmpty = (value) => typeof value === "string" && value.trim().length > 0;