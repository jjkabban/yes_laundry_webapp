import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

type Props = {
  name: keyof typeof Icons;
  size?: number;
  strokeWidth?: number;
  color?: string;
} & LucideProps;

export default function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  color,
  ...rest
}: Props) {
  const LucideIcon = Icons[name] as React.FC<LucideProps>;

  if (!LucideIcon) return null;

  return (
    <LucideIcon size={size} strokeWidth={strokeWidth} color={color} {...rest} />
  );
}
