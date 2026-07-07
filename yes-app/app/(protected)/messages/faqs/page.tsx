"use client";

import { ArrowLeft, ChevronDown, Cross, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type FAQsType = { id: string; question: string; answer: string };
type FAQsGroupType = { id: string; title: string; faqs: FAQsType[] };
const FAQs: FAQsGroupType[] = [
  {
    id: "pickup-delivery",
    title: "Pickup & Delivery",
    faqs: [
      {
        id: "schedule-pickup",
        question: "How do I schedule a pickup?",
        answer:
          "Select a service, choose your preferred pickup date and time slot, confirm your address, and place your order.",
      },
      {
        id: "change-pickup",
        question: "Can I change my pickup date or time?",
        answer:
          "Yes. You can reschedule your pickup before the scheduled pickup time, subject to availability.",
      },
      {
        id: "change-address",
        question: "Can I change my pickup or delivery address?",
        answer:
          "Yes. You can update your address before your order has been picked up.",
      },
      {
        id: "delivery-time",
        question: "How long does delivery take?",
        answer:
          "Delivery times vary depending on the service selected, but most orders are completed within 24–72 hours.",
      },
    ],
  },

  {
    id: "pricing-payment",
    title: "Pricing & Payment",
    faqs: [
      {
        id: "price-calculation",
        question: "How is the price calculated?",
        answer:
          "Pricing depends on the service selected, the number of items or bags, and any add-ons you choose.",
      },
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer:
          "We accept Mobile Money, debit cards, credit cards, and other supported payment methods.",
      },
      {
        id: "payment-time",
        question: "When will I be charged?",
        answer:
          "Payment is processed after you confirm your order or according to the payment option you selected.",
      },
      {
        id: "refund",
        question: "Can I request a refund?",
        answer:
          "Yes. If you're eligible for a refund, it will be processed back to your original payment method.",
      },
    ],
  },

  {
    id: "cleaning-care",
    title: "Cleaning & Care",
    faqs: [
      {
        id: "accepted-items",
        question: "What items do you clean?",
        answer:
          "We clean clothes, bedding, towels, curtains, and other supported household fabrics.",
      },
      {
        id: "stain-removal",
        question: "Can you remove all stains?",
        answer:
          "We use professional stain treatment methods, but complete stain removal cannot always be guaranteed.",
      },
      {
        id: "delicates",
        question: "Do you clean delicate fabrics?",
        answer:
          "Yes. Delicate garments are handled with appropriate care and cleaning methods.",
      },
      {
        id: "separate-wash",
        question: "Will my clothes be washed separately?",
        answer:
          "Yes. Your laundry is processed separately to maintain quality and hygiene.",
      },
    ],
  },

  {
    id: "orders-tracking",
    title: "Orders & Tracking",
    faqs: [
      {
        id: "track-order",
        question: "How do I track my order?",
        answer:
          "Open the Orders section in the app to see the latest status and progress of your order.",
      },
      {
        id: "cancel-order",
        question: "Can I cancel my order?",
        answer:
          "Yes. Orders can be cancelled before pickup has been completed.",
      },
      {
        id: "order-status",
        question: "What do the different order statuses mean?",
        answer:
          "Each status shows the current stage of your order, from pickup through cleaning to delivery.",
      },
      {
        id: "missing-item",
        question: "What should I do if an item is missing?",
        answer:
          "Contact our support team immediately. We'll investigate and work to resolve the issue as quickly as possible.",
      },
    ],
  },

  {
    id: "account-support",
    title: "Account & Support",
    faqs: [
      {
        id: "need-account",
        question: "Do I need an account to place an order?",
        answer:
          "Yes. An account allows you to manage your orders, addresses, and payment methods.",
      },
      {
        id: "edit-profile",
        question: "How do I update my profile information?",
        answer:
          "Go to your Profile page, select Edit Profile, make your changes, and save them.",
      },
      {
        id: "contact-support",
        question: "How can I contact customer support?",
        answer:
          "You can reach us through the in-app support chat or by using the contact information provided in the Help & Support section.",
      },
      {
        id: "notifications",
        question: "Can I manage my notification preferences?",
        answer:
          "Yes. Go to Notification Settings to choose how you'd like to receive updates via email, SMS, or push notifications.",
      },
    ],
  },
];

export default function FAQSPage() {
  const params = useSearchParams();
  const id = params.get("fid");
  const router = useRouter();
  const [selectedFaq, setSelectedFaq] = useState<string>();

  const faq = useMemo(() => {
    const getFaq = FAQs.find((fq) => fq.id === id);
    if (!getFaq) {
      return FAQs;
    }
    return [getFaq];
  }, [id]);

  return (
    <div className="px-4 py-3">
      <div className="flex px-3 gap-3 fixed top-0 left-0 right-0 w-full bg-bgBase py-3">
        <button onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
      </div>

      <div className="pt-12">
        <p className="text-lg font-medium leading-tight">
          Find answers to our most frequently asked questions.
        </p>
      </div>

      <div className="py-10">
        {faq.map((fq, idx) => {
          return (
            <div
              key={fq.id + fq.title}
              className={`py-5 ${faq.length !== idx && "border-b-4 border-b-paragraph/10"}`}
            >
              <div className="px-2">
                <h3 className="font-semibold text-[18px] text-brand ">
                  {fq.title}
                </h3>

                <div className="my-2">
                  {fq.faqs.map((itm, itidx) => {
                    const isSelected = itm.id === selectedFaq;
                    return (
                      <div
                        key={itm.id}
                        className={`py-3 ${fq.faqs.length - 1 !== itidx && "border-b border-b-paragraph/20"}`}
                        onClick={() => {
                          setSelectedFaq(itm.id);
                        }}
                      >
                        <div className={`flex items-center gap-2 py-3`}>
                          <motion.button
                            initial={{ rotate: 0 }}
                            animate={{ rotate: isSelected ? "180deg" : "0deg" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                          >
                            <ChevronDown size={20} color="#444" />
                          </motion.button>
                          <h2 className="text-[15px] font-medium">
                            {itm.question}
                          </h2>
                        </div>

                        {isSelected && (
                          <p className="text-paragraph/90 text-[14px] py-3 ">
                            {itm.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pb-10">
        <span>
          <span className="font-medium"> Didn't find your answer? </span>
          <span>
            Contact our support team and we'll be happy to assist you.
          </span>
        </span>

        <button
          onClick={() => {
            router.push(
              "/messages/conversation-home/conversation-chat?type=support",
            );
          }}
          className="block font-medium  bg-brand text-white rounded-full px-4 py-3 w-full  items-center mt-4"
        >
          Contact support
        </button>
      </div>
    </div>
  );
}
