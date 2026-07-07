"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Check,
  CreditCard,
  Trash2,
  Edit,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { BottomSheet } from "@/components/components";
import { useRouter } from "next/navigation";

type PaymentProvider = "mtn" | "telecel" | "airtelTigo";

interface PaymentMethod {
  id: string;
  provider: PaymentProvider;
  phoneNumber: string;
  isDefault: boolean;
  lastUsed?: string;
  createdAt: string;
  name?: string;
}

// Mock data - in real app, this would come from your API
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_001",
    provider: "mtn",
    phoneNumber: "0241234567",
    isDefault: true,
    lastUsed: "2026-06-28T14:30:00Z",
    createdAt: "2026-06-01T10:00:00Z",
    name: "MTN",
  },
  {
    id: "pm_002",
    provider: "telecel",
    phoneNumber: "0209876543",
    isDefault: false,
    lastUsed: "2026-06-25T09:15:00Z",
    createdAt: "2026-06-15T08:00:00Z",
    name: "Telecel",
  },
  {
    id: "pm_003",
    provider: "airtelTigo",
    phoneNumber: "0274567890",
    isDefault: false,
    lastUsed: "2026-06-20T16:45:00Z",
    createdAt: "2026-06-10T11:30:00Z",
    name: "AirtelTigo",
  },
];

const providerConfigs = {
  mtn: {
    label: "MTN Mobile Money",
    image: "/images/mtn.jpg",
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    placeholder: "024XXXXXXX",
    prefix: "024",
  },
  telecel: {
    label: "Telecel Cash",
    image: "/images/telecel.jpg",
    color: "bg-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    placeholder: "020XXXXXXX",
    prefix: "020",
  },
  airtelTigo: {
    label: "AirtelTigo Money",
    image: "/images/airtelTigo.jpg",
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    placeholder: "027XXXXXXX",
    prefix: "027",
  },
};

export default function PaymentPage() {
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider>("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [methodName, setMethodName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number
    const cleanNumber = phoneNumber.replace(/\s/g, "");
    if (!cleanNumber.match(/^0[0-9]{9}$/)) {
      setError("Please enter a valid 10-digit phone number starting with 0");
      return;
    }

    // Check if number already exists
    const existing = paymentMethods.find(
      (pm) =>
        pm.phoneNumber === cleanNumber && pm.provider === selectedProvider,
    );
    if (existing) {
      setError(
        `This number is already added for ${providerConfigs[selectedProvider].label}`,
      );
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        provider: selectedProvider,
        phoneNumber: cleanNumber,
        isDefault: isDefault,
        lastUsed: undefined,
        createdAt: new Date().toISOString(),
        name: methodName || undefined,
      };

      // If new method is default, remove default from others
      let updatedMethods = [...paymentMethods];
      if (isDefault) {
        updatedMethods = updatedMethods.map((pm) => ({
          ...pm,
          isDefault: false,
        }));
      }

      setPaymentMethods([newMethod, ...updatedMethods]);
      setIsLoading(false);
      setShowAddModal(false);
      resetForm();
    }, 500);
  };

  const resetForm = () => {
    setSelectedProvider("mtn");
    setPhoneNumber("");
    setMethodName("");
    setIsDefault(false);
    setError("");
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    );
  };

  const formatPhoneNumber = (number: string) => {
    // Format as 024 123 4567
    if (number.length >= 10) {
      return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 10)}`;
    }
    return number;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="px-4 py-2 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b py-2 border-b-paragraph/20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft />
          </button>
          <h1 className="text-[20px] font-bold text-gray-800">
            Payment Methods
          </h1>
        </div>
        {paymentMethods.length !== 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="mt-24 p-8 text-center">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-brand" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Payment Methods
          </h3>
          <p className="text-paragraph/60 text-sm mb-4">
            Add a mobile money number to make payments easier
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand text-white px-6 py-2.5 rounded-xl hover:bg-brand/90 transition-colors"
          >
            Add Payment Method
          </button>
        </div>
      ) : (
        <div className="space-y-3 mt-10">
          {paymentMethods.map((method) => {
            const config = providerConfigs[method.provider];
            return (
              <div
                key={method.id}
                className={`bg-white rounded-2xl border 
                     border-paragraph/20
                 p-4 transition-all hover:shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 overflow-hidden  relative rounded-md flex items-center justify-center shrink-0`}
                    >
                      <Image src={config.image} fill alt="method_images" />
                    </div>
                    <div className="flex-1 min-w-0 leading-tight">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800">
                          {method.name || config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-gray-600 font-medium">
                          {formatPhoneNumber(method.phoneNumber)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => setShowDeleteConfirm(method.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <BottomSheet open={showAddModal} onClose={() => {}} height="90%">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Add Payment Method
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-paragraph/60" />
              </button>
            </div>

            <form onSubmit={handleAddPaymentMethod} className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Network Providers
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(providerConfigs).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setSelectedProvider(key as PaymentProvider)
                      }
                      className={`p-3 flex items-center flex-col gap-2 rounded-xl border-2 text-center transition-all ${
                        selectedProvider === key
                          ? `border-brand `
                          : "border-paragraph/20 hover:border-paragraph/40"
                      }`}
                    >
                      <div className="h-8 w-8 relative">
                        <Image src={config.image} fill alt="method" />
                      </div>

                      <span className="text-xs font-medium text-gray-700">
                        {config.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    +233
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setPhoneNumber(value);
                      }
                    }}
                    placeholder={providerConfigs[selectedProvider].placeholder}
                    className="w-full pl-16 pr-4 py-2.5 border border-paragraph/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40 transition"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-paragraph/40 mt-1">
                  Enter 10-digit number starting with 0
                </p>
              </div>

              {/* Name (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={methodName}
                  onChange={(e) => setMethodName(e.target.value)}
                  placeholder="e.g., Personal MTN, Work Telecel"
                  className="w-full px-4 py-2.5 border border-paragraph/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40 transition"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-full bg-brand text-white py-2.5  hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </BottomSheet>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Delete Payment Method
                </h3>
                <p className="text-[13px] text-paragraph/20 mt-1">
                  This action cannot be undone. Are you sure you want to remove
                  this payment method?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePaymentMethod(showDeleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
