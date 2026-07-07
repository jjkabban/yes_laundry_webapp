export type UserLocation = {
  address: string | null;
  city: string | null;
  neighborhood: string | null;
  isDefault: boolean;
  label: string | null;
};

export type Roles = "CUSTOMER" | "ADMIN" | "STAFF";
export type User = {
  firstName: string;
  lastName: string;
  role: Roles;
  id: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  address: UserLocation[];
};
