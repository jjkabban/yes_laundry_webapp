import Image from "next/image";

type Props = {
  title: string;
  description: string;
  amount: number;
  image: string;
};

export default function FixedPromoCard({
  title,
  description,
  amount,
  image,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg h-[200]">
      <Image src={image} alt={title} fill className="object-cover" />

      <div className="absolute inset-0 bg-linear-to-t from-blue-950/90 via-black/40 to-transparent" />

      <div className="absolute bottom-0 p-4 text-white">
        <p className="text-xs text-white/70 uppercase">Cashback Style Offer</p>

        <h3 className="text-2xl font-bold">GH₵{amount} OFF</h3>

        <p className="text-sm text-white/80">{title}</p>

        <p className="text-xs text-white/60 mt-1">{description}</p>

        <button className="mt-3 rounded-full bg-white text-blue-900 px-4 py-1 text-xs font-medium">
          Apply
        </button>
      </div>
    </div>
  );
}
