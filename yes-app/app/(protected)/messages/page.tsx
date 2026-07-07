"use client";

import { Logo } from "@/components/ui";
import {
  ChevronDown,
  ChevronRight,
  Info,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { BottomSheet } from "@/components/components";
import { Modal } from "@/components/ui/Modal";

const FAQs = [
  {
    id: "pickup-delivery",
    title: "Pickup & Delivery",
  },

  {
    id: "pricing-payment",
    title: "Pricing & Payment",
  },

  {
    id: "cleaning-care",
    title: "Cleaning & Care",
  },

  {
    id: "orders-tracking",
    title: "Orders & Tracking",
  },

  {
    id: "account-support",
    title: "Account & Support",
  },
];

const images = ["/images/user1.jpg", "/images/user2.jpg", "/images/user3.jpg"];

type EnquiryType =
  | "Order and related issues"
  | "Pickup & Delivery"
  | "Payments & Billing"
  | "Service & Item Care"
  | "General Enquiry";
const EQUIRIES: EnquiryType[] = [
  "General Enquiry",
  "Order and related issues",
  "Payments & Billing",
  "Pickup & Delivery",
  "Service & Item Care",
];

type EnquiryMessageType = { enquiry: EnquiryType; message: string };
type SheetContentType = "enquiry" | "faqs" | null;
export default function MessagesHome() {
  const [enquiry, setEnquiry] = useState<EnquiryMessageType | null>(null);
  const enquiryCount = useRef(0);
  const [openSheet, setOpenSheet] = useState(false);
  const router = useRouter();
  const [sheetContent, setSheetContent] = useState<SheetContentType>(null);
  const [enquiryInput, setEnquiryInput] = useState<{
    title: EnquiryType;
    message: string;
  }>({ title: "General Enquiry", message: "" });
  const [openModal, setOpenModal] = useState(false);

  const onCloseSheet = useCallback(() => {
    setSheetContent(null);
    setOpenSheet(false);
  }, [openSheet, sheetContent]);

  const onOpenSheet = useCallback(
    (content: SheetContentType) => {
      setSheetContent(content);
      setOpenSheet(true);
    },
    [openSheet, sheetContent],
  );

  const onEnquirySubmit = useCallback(() => {
    const title = enquiryInput.title;
    const msg = enquiryInput?.message.trim();
    setEnquiry({ enquiry: title as EnquiryType, message: msg as string });
    onCloseSheet();
    ++enquiryCount.current;
  }, [enquiry]);
  return (
    <div className="">
      <div className="bg-linear-to-b from-brand via-brand/80 to-transparent p-3 px-4">
        <div className="flex items-center justify-between text-white ">
          <Logo type="light" height={180} width={160} />

          <div className="flex items-center gap-4">
            <div className="flex">
              {images.map((img, idx) => (
                <div
                  key={img + idx}
                  className={`relative h-${8 - idx} w-${8 - idx} rounded-full overflow-hidden border-black border-2`}
                >
                  <Image
                    src={img}
                    fill
                    alt="user_image"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                router.back();
              }}
            >
              <X />
            </button>
          </div>
        </div>

        <div className="shadow-2xs  mt-12">
          <h3 className="text-3xl font-bold text-white">Hi, Justice</h3>
          <h3 className="text-2xl font-medium text-white">How can we help?</h3>
        </div>

        <div className="bg-white mt-7 rounded-md px-4 py-3 flex flex-col gap-4">
          <button
            onClick={() => {
              onOpenSheet("enquiry");
            }}
            className="flex items-center justify-between py-3 border-b-2 border-b-paragraph/10"
          >
            <span className="text-paragraph text-[16px]">Make an enquiry</span>

            <div className="flex items-cen gap-2">
              {enquiryCount.current > 0 && (
                <span className="text-brand font-bold">
                  {enquiryCount.current}
                </span>
              )}
              <Info size={20} />
            </div>
          </button>

          <button
            onClick={() => {
              router.push("/messages/conversations-home");
            }}
            className="flex items-center justify-between"
          >
            <span className="text-paragraph text-[16px]">Check messages</span>
            <MessageSquare size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white shadow-xs border-[1] border-paragraph/10 rounded-2xl mx-4 mt-2 px-4 py-2">
        <h3 className="text-[18px] py-2 border-b-[1] font-medium border-b-paragraph/8">
          Helpful FAQs
        </h3>

        <div className="">
          {FAQs.map((faq, idx) => (
            <div
              onClick={() => {
                router.push(`/messages/faqs?fid=${faq.id}`);
              }}
              key={faq.title}
              className={`py-3.5  flex justify-between items-center ${FAQs.length - 1 !== idx ? " border-b-paragraph/5 border-b-[1]" : ""}`}
            >
              <h2 className="text-[15px] text-paragraph/90">{faq.title}</h2>
              <ChevronRight size={18} className="text-paragraph/50" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-4 ">
        <button
          onClick={() => {
            router.push(
              "/messages/conversations-home/conversation-chat?type=support",
            );
          }}
          className=" w-full px-2 py-3 border-[1] border-paragraph/10 rounded-xl  bg-white shadow-2xs flex  items-center justify-between"
        >
          <span>Send us a message</span>
          <Send size={20} />
        </button>
      </div>

      <BottomSheet open={openSheet} onClose={onCloseSheet} height="90%">
        <div className="py-3 px-4">
          <button
            onClick={onCloseSheet}
            className="flex justify-end p-2 w-full"
          >
            <X />
          </button>
          {sheetContent === "enquiry" ? (
            <div>
              <h2 className="text-xl font-semibold">Make an Enquiry</h2>

              <div className="mt-4">
                <h2 className="text-lg font-medium">Select type</h2>

                <button
                  onClick={() => {
                    setOpenModal(true);
                  }}
                  className="flex w-full items-center justify-between border border-paragraph/30 mt-3  rounded-md py-2.5 px-4"
                >
                  <span className="">{enquiryInput.title}</span>
                  <ChevronDown color="#888" size={20} />
                </button>
              </div>

              <div className="mt-6 w-full">
                <h2 className="text-lg font-medium">Message</h2>

                <div className="w-full mt-1 ">
                  <textarea
                    value={enquiryInput.message}
                    onChange={(e) => {
                      setEnquiryInput((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }));
                    }}
                    placeholder="Enter your message"
                    rows={4}
                    className="w-full border border-paragraph/30 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40 transition"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  className={
                    "bg-brand w-full font-mediun text-white px-4 py-3 rounded-full"
                  }
                  onClick={onEnquirySubmit}
                >
                  Submit enquiry
                </button>
              </div>

              {/* enquiry modal */}

              <Modal
                isOpen={openModal}
                onClose={() => {
                  setOpenModal(false);
                }}
              >
                <div className="flex flex-col items-start">
                  {EQUIRIES.map((enq, index) => (
                    <button
                      onClick={() => {
                        setEnquiryInput((prev) => ({ ...prev, title: enq }));
                        setOpenModal(false);
                      }}
                      className={`py-4 w-full text-start ${EQUIRIES.length - 1 !== index && "border-b border-b-paragraph/20"}`}
                      key={enq + index}
                    >
                      {enq}
                    </button>
                  ))}
                </div>
              </Modal>
            </div>
          ) : sheetContent === "faqs" ? (
            <div></div>
          ) : null}
        </div>
      </BottomSheet>
    </div>
  );
}
