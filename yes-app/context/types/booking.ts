export type BookingDataType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  notes: string;
  deliveryAddress: string;
  email?: string;
};

export type BookingDataContextType = {
  saveFormData: (data: BookingDataType, extInfo?: string) => void;
  isLoading: boolean;
  formData: BookingDataType | null;
  extraInfo?: string;
  clearFormData: () => void;
};
