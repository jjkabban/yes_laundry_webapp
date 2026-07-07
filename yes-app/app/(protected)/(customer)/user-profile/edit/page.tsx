"use client";

import { ArrowLeft, Camera, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  profileImage: string | null;
};

export default function EditProfilePage() {
  const router = useRouter();

  // TODO: seed this from your AuthContext / user query instead of a mock
  const [form, setForm] = useState<FormState>({
    firstName: "Justice",
    lastName: "Abban",
    phone: "0241234567",
    email: "",
    profileImage: null,
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`;

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handlePickImage = () => fileInputRef.current?.click();

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, profileImage: previewUrl }));
    // TODO: hold onto `file` and upload it alongside the form submit,
    // or upload immediately and store the returned URL instead.
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!/^0\d{9}$/.test(form.phone.trim()))
      next.phone = "Enter a valid 10-digit phone number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call, e.g.
      // await fetch("/api/user/profile", {
      //   method: "PATCH",
      //   body: JSON.stringify(form),
      // });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative pb-10 min-h-screen bg-bgBase">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 fixed top-0 left-0 right-0 z-20  flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} aria-label="Go back">
            <ArrowLeft className="" />
          </button>
          <h1 className="text-xl  font-bold">Edit profile</h1>
        </div>
      </div>

      <div className="pt-24 px-4 flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            {form.profileImage ? (
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-[1] border-paragraph/20">
                <Image
                  src={form.profileImage}
                  fill
                  alt="profile"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-brand/10 flex items-center justify-center">
                <span className="text-brand font-semibold text-2xl">
                  {initials}
                </span>
              </div>
            )}

            <button
              onClick={handlePickImage}
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-brand flex items-center justify-center border-2 border-white"
            >
              <Camera size={14} className="text-white" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelected}
            />
          </div>
          <span className="text-[13px] text-paragraph/60">
            Tap the camera to change your photo
          </span>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 bg-white shadow-2xs p-4 rounded-2xl border-[1] border-paragraph/30">
          <Field
            label="First name"
            value={form.firstName}
            onChange={handleChange("firstName")}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Field
            label="Last name"
            value={form.lastName}
            onChange={handleChange("lastName")}
            error={errors.lastName}
            autoComplete="family-name"
          />
          <Field
            label="Phone number"
            value={form.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
            type="tel"
            autoComplete="tel"
          />
          <Field
            label="Email (optional)"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            type="email"
            autoComplete="email"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-brand text-white font-medium py-3.5 rounded-xl disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-paragraph/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`h-12 px-3.5 rounded-xl border-[1] bg-bgBase outline-none text-[15px] ${
          error
            ? "border-red-400 focus:border-red-400"
            : "border-paragraph/20 focus:border-brand"
        }`}
      />
      {error && <span className="text-[12px] text-red-500">{error}</span>}
    </label>
  );
}
