"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Check,
  ChevronRight,
  Calendar,
  MapPin,
  Package,
  Clock,
  CreditCard,
  Phone,
  User,
  Mail,
  MessageSquare,
  ShoppingBag,
  Trash2,
  Edit,
  Plus,
  Loader2,
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  closeOnOutsideClick = true,
  closeOnEsc = true,
  maxWidth = "md",
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  };

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "unset";
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center p-4 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity duration-300`}
      onClick={closeOnOutsideClick ? onClose : undefined}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className={`relative bg-white rounded-2xl w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-hidden shadow-2xl ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } transition-all duration-300 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors z-10"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
        <div className="overflow-y-auto max-h-[90vh] p-6 scrollbar-thin scrollbar-thumb-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  const variantConfigs = {
    danger: {
      icon: AlertCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
      buttonText: "text-white",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
      buttonText: "text-white",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      buttonText: "text-white",
    },
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonBg: "bg-green-600 hover:bg-green-700",
      buttonText: "text-white",
    },
  };

  const config = variantConfigs[variant];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center">
        <div
          className={`w-14 h-14 rounded-full ${config.iconBg} flex items-center justify-center mx-auto mb-4`}
        >
          <Icon size={28} className={config.iconColor} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 ${config.buttonBg} ${config.buttonText} rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "Done",
}: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  isLoading = false,
}: FormModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {children}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand/90 transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                submitText
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: DetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
        {actions && (
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            {actions}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function ModalDemo() {
  const [modals, setModals] = useState({
    confirmation: false,
    success: false,
    form: false,
    detail: false,
    payment: false,
    address: false,
    delete: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const showModal = (key: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [key]: true }));
  };

  const hideModal = (key: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [key]: false }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      hideModal("form");
      showModal("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Modal Components
        </h1>
        <p className="text-gray-500 mb-8">
          Various modal styles for your laundry application
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => showModal("confirmation")}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <p className="font-medium text-gray-800">Confirmation</p>
            <p className="text-xs text-gray-500">Danger/Warning actions</p>
          </button>

          <button
            onClick={() => showModal("success")}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <p className="font-medium text-gray-800">Success</p>
            <p className="text-xs text-gray-500">Completion messages</p>
          </button>

          <button
            onClick={() => showModal("form")}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Edit size={20} className="text-blue-600" />
            </div>
            <p className="font-medium text-gray-800">Form Modal</p>
            <p className="text-xs text-gray-500">Input forms</p>
          </button>

          <button
            onClick={() => showModal("detail")}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <Package size={20} className="text-purple-600" />
            </div>
            <p className="font-medium text-gray-800">Detail View</p>
            <p className="text-xs text-gray-500">Order details</p>
          </button>

          <button
            onClick={() => showModal("payment")}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
              <CreditCard size={20} className="text-yellow-600" />
            </div>
            <p className="font-medium text-gray-800">Payment</p>
            <p className="text-xs text-gray-500">Payment methods</p>
          </button>

          <button
            onClick={() => showModal("delete")}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-2">
              <Trash2 size={20} className="text-rose-600" />
            </div>
            <p className="font-medium text-gray-800">Delete</p>
            <p className="text-xs text-gray-500">Permanent deletion</p>
          </button>
        </div>

        {/* ====== MODALS ====== */}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={modals.confirmation}
          onClose={() => hideModal("confirmation")}
          onConfirm={() => {
            hideModal("confirmation");
            showModal("success");
          }}
          title="Delete Order #ORD-1234?"
          message="This action cannot be undone. This will permanently delete the order and all associated data."
          confirmText="Delete Order"
          cancelText="Cancel"
          variant="danger"
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={modals.success}
          onClose={() => hideModal("success")}
          title="Order Deleted Successfully"
          message="The order has been permanently removed from your records."
          buttonText="Done"
        />

        {/* Form Modal */}
        <FormModal
          isOpen={modals.form}
          onClose={() => hideModal("form")}
          onSubmit={handleFormSubmit}
          title="Edit Profile"
          description="Update your personal information"
          submitText="Save Changes"
          isLoading={isLoading}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40 transition"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40 transition"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40 transition"
                placeholder="024XXXXXXX"
              />
            </div>
          </div>
        </FormModal>

        {/* Detail Modal */}
        <DetailModal
          isOpen={modals.detail}
          onClose={() => hideModal("detail")}
          title="Order Details"
          actions={
            <>
              <button className="flex-1 px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand/90 transition-colors text-sm font-medium">
                Track Order
              </button>
              <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
                Close
              </button>
            </>
          }
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Order Number</p>
                <p className="font-medium text-gray-800">#ORD-1234</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Delivered
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Delivery Address</p>
                  <p className="text-sm text-gray-800">
                    123 Main St, Accra, Ghana
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Items</p>
                  <p className="text-sm text-gray-800">3 items</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-sm font-bold text-gray-800">GHS 45.00</p>
                </div>
              </div>
            </div>
          </div>
        </DetailModal>

        {/* Payment Modal */}
        <Modal
          isOpen={modals.payment}
          onClose={() => hideModal("payment")}
          maxWidth="md"
        >
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add Payment Method
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {["MTN", "Telecel", "AirtelTigo"].map((provider) => (
                  <button
                    key={provider}
                    className="p-3 border-2 border-gray-200 rounded-xl hover:border-brand transition-colors text-center"
                  >
                    <span className="block text-2xl mb-1">📱</span>
                    <span className="text-xs font-medium text-gray-700">
                      {provider}
                    </span>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="024XXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40 transition"
                />
              </div>
              <button className="w-full bg-brand text-white py-2.5 rounded-xl hover:bg-brand/90 transition-colors text-sm font-medium">
                Add Payment Method
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={modals.delete}
          onClose={() => hideModal("delete")}
          onConfirm={() => {
            hideModal("delete");
            showModal("success");
          }}
          title="Delete Account?"
          message="All your data including orders, profile information, and payment methods will be permanently deleted. This action cannot be undone."
          confirmText="Yes, Delete Account"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </div>
  );
}
