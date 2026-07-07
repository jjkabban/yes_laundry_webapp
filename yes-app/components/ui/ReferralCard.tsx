"use client";

import { Check, Copy, Gift, Share2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BottomSheet } from "../components";

type ReferralCardProps = {
  title?: string;
  description?: string;
  yourReward?: string;
  friendReward?: string;
  image?: string;
  referralCode?: string;
  referralLink?: string;
};

function legacyCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const succeeded = document.execCommand("copy");
  document.body.removeChild(textarea);
  return succeeded;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to legacy path
    }
  }
  return legacyCopy(text);
}

export default function ReferralCard({
  title = "Refer a Friend",
  description = "Invite friends and earn rewards when they complete their first order.",
  yourReward = "GH₵10 Credit",
  friendReward = "10% Off First Order",
  image = "/images/ref2.jpg",
  referralCode = "JUSTICE10",
  referralLink = "https://yeslaundry.app/r/JUSTICE10",
}: ReferralCardProps) {
  const [openSheet, setOpenSheet] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(
      `Get ${friendReward} on Yes Laundry — use my code ${referralCode} or tap this link: ${referralLink}`,
    );
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpenSheet(true)}
        aria-label={`${title} — tap to get your referral code`}
        className="relative flex md:w-[400px] overflow-hidden rounded-2xl shadow-lg min-h-[180px] mx-5 mt-3 text-left active:scale-[0.99] transition-transform"
      >
        <div className="bg-white py-3 px-4 flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-[14px] py-3 text-paragraph/70">{description}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Gift size={15} className="text-brand shrink-0" />
              <span className="text-[13px] text-brand font-semibold">
                {friendReward} for them
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Share2 size={13} className="text-paragraph/50 shrink-0" />
              <span className="text-[12px] text-paragraph/60">
                {yourReward} for you
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-[120px] sm:w-[140px] shrink-0">
          <Image src={image} fill alt="" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-l from-black/10 to-transparent" />
        </div>
      </button>

      <BottomSheet
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        height="70%"
      >
        <div className="p-3">
          <div className="flex justify-end w-full px-2 py-1">
            <button onClick={() => setOpenSheet(false)} aria-label="Close">
              <X />
            </button>
          </div>

          <div className="px-5 pb-6 pt-2 flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center">
              <Gift size={22} className="text-brand" />
            </div>

            <div>
              <h3 className="font-semibold text-[16px]">Your referral code</h3>
              <p className="text-[13px] text-paragraph/60 mt-1">
                {friendReward} for them, {yourReward} for you when they complete
                their first order.
              </p>
            </div>

            <div className="w-full bg-bgBase rounded-2xl px-4 py-3.5 flex items-center justify-between">
              <span className="font-semibold tracking-widest text-[18px] text-paragraph">
                {referralCode}
              </span>
              <button
                onClick={handleCopy}
                aria-label="Copy referral code"
                className="flex items-center gap-1.5 bg-brand px-3.5 py-2 rounded-full shrink-0"
              >
                {copied ? (
                  <Check size={14} className="text-white" />
                ) : (
                  <Copy size={14} className="text-white" />
                )}
                <span className="text-[13px] text-white font-medium">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
