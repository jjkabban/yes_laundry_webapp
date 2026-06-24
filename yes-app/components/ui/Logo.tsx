import Image from "next/image";
import Link from "next/link";

type Props = {
  height: number;
  width: number;
  type?: "light" | "coloured";
};
export default function Logo({ height, width, type = "coloured" }: Props) {
  return (
    <Link href={"/"} className="">
      <Image
        src={
          type === "coloured" ? "/images/logo.png" : "/images/footer-logo.png"
        }
        height={height}
        width={width}
        loading="eager"
        alt="logo"
      />
    </Link>
  );
}
