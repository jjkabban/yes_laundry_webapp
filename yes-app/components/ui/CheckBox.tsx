import { Check } from "lucide-react";

type Props = {
  checked: boolean;
  className?: string;
};

export default function CheckBox({ checked, className }: Props) {
  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 transition-colors ${
        checked ? "bg-brand border-brand" : "bg-white border-paragraph/60"
      } ${className ?? ""}`}
    >
      {checked && <Check size={14} className="text-white" strokeWidth={3.4} />}
    </div>
  );
}
