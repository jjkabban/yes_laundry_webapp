import crypto from "crypto";

export const getOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};
