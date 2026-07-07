export type Role = "ADMIN" | "STAFF" | "CUSTOMER";

export type LoginRequestPayload = {
  phoneNumber: string;
  password: string;
  rememberMe: boolean;
  email: string;
};
export type UserLocation = {
  address: string | null;
  city: string | null;
  neighborhood: string | null;
  isDefault: boolean;
  label: string | null;
};
export type User = {
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber: string | null;
  email: string | null;
  id: string;
  profileImage?: string;
  address: UserLocation[];
};
export type LoginResponsePayload = User;
export type RegisterRequestPayload = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
  email?: string;
};
export type RegisterResponsePayload = {
  id: string;
};

export type VerifyRequestPayload = {
  code: string;
  id: string;
};

export type VerifyResponsePayload = User;

export type PhoneNumberSignupPayload = {
  phoneNumber: string;
  id: string;
};

export type LocationResponsePayload = {
  address: string | null;
  city: string | null;
  neighborhood: string | null;
};

export type LocationRequestPayload = {
  label: string;
  isDefault: boolean;
  address: string;
};
