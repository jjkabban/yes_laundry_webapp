import { Gift } from "lucide-react";
import Image from "next/image";

//   title = "Refer a Friend",
//   description = "Invite friends and earn rewards when they complete their first order.",
//   yourReward = "GH₵10 Credit",
//   friendReward = "10% Off First Order",
//   image,

export default function ReferralCard({}) {
  return (
    <div className="relative flex  overflow-hidden md:w-1/3 rounded-2xl shadow-lg min-h-[180] mx-5 mt-3">
      <div className="bg-white py-3 px-4">
        <h3 className="font-medium">Refer a Friend</h3>
        <p className="text-[14px] py-3">
          Invite friends and earn rewards when they complete their first order.
        </p>
        <div className="flex items-center mt-3 gap-1">
          <Gift />
          <span className="text-[14px] text-brand font-semibold">
            10% Off First Order
          </span>
        </div>
      </div>

      <div className="h-[180] relative w-full">
        <Image
          src={"/images/ref2.jpg"}
          fill
          alt="referral_image"
          className="object-cover"
        />
      </div>
    </div>
  );
}
