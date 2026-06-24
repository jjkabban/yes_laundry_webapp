import Image from "next/image";

type Props = {
  title: string;
  description: string;
  value: number;
  image: string;
};

export default function PercentagePromoCard({
  title,
  description,
  value,
  image,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg h-[200]">
      {/* Image */}
      <Image src={image} alt={title} fill className="object-cover" />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 p-4 text-white">
        <p className="text-xs uppercase tracking-wider text-white/70">
          Limited Offer
        </p>

        <h3 className="text-xl font-bold">{value}% OFF</h3>

        <p className="text-sm text-white/80">{title}</p>

        <p className="text-xs text-white/60 mt-1">{description}</p>

        <button className="mt-3 rounded-full bg-white text-black px-4 py-1 text-xs font-medium">
          Use Offer
        </button>
      </div>
    </div>
  );
}
