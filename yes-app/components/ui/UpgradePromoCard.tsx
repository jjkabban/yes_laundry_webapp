import Image from "next/image";

type Props = {
  title: string;
  description: string;
  image: string;
};

export default function UpgradePromoCard({ title, description, image }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg h-[200]">
      <Image src={image} alt={title} fill className="object-cover" />

      <div className="absolute inset-0 bg-linear-to-t from-purple-950/90 via-black/40 to-transparent" />

      <div className="absolute bottom-0 p-4 text-white">
        <p className="text-xs uppercase text-white/70">Premium Upgrade</p>

        <h3 className="text-xl font-bold">⚡ {title}</h3>

        <p className="text-sm text-white/80">{description}</p>

        <button className="mt-3 rounded-full bg-white text-purple-900 px-4 py-1 text-xs font-medium">
          Enable
        </button>
      </div>
    </div>
  );
}
