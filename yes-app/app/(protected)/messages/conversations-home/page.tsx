"use client";

import Icon from "@/components/icons/LucideIcons";
import { formatOrderTime } from "@/utils/datetime";
import {
  ArrowLeft,
  MessageCircleCheck,
  MessageCircleOff,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MessageType = "support" | "info" | "general";
type ConversationType = {
  title: string;
  icon: string;
  lastMsg: string;
  timeAgo: Date;
  id: string; // to fetch the conversation
  msgSubject: string;
  msgCount: number;
  isRead: boolean;
  type: MessageType;
};

const mockConversation: ConversationType[] = [
  {
    title: "Customer support",
    icon: "Info",
    lastMsg: "What are the most current places you do pick up ",
    timeAgo: new Date(),
    id: "eikdkkjakjdj",
    msgSubject: "Look at order 2",
    msgCount: 4,
    isRead: false,
    type: "info",
  },
  {
    title: "Customer support",
    icon: "Phone",
    lastMsg: "How can I do this ",
    timeAgo: new Date(),
    id: "eikdkkjakjdj",
    msgSubject: "Look at order 2",
    msgCount: 5,
    isRead: true,
    type: "support",
  },
  {
    title: "Customer support",
    icon: "MessageSquare",
    lastMsg: "How can I do this ",
    type: "general",
    timeAgo: new Date(),
    id: "eikdkkjakjdj",
    msgSubject: "Look at order 2",
    msgCount: 6,
    isRead: false,
  },
  {
    title: "Customer support",
    icon: "Info",
    lastMsg: "How can I do this ",
    timeAgo: new Date(),
    id: "eikdkkjakjdj",
    msgSubject: "Look at order 2",
    msgCount: 9,
    isRead: false,
    type: "support",
  },
];

const ct_colors: Record<MessageType, { bg: string; text: string }> = {
  general: { bg: "#03d3fe", text: "#fd32dd" },
  info: { bg: "#f0f0fe", text: "#edfede" },
  support: { bg: "#e3defe", text: "#feedd3" },
};

export default function ConversationHomePage() {
  const router = useRouter();
  const [conversations, setConversations] = useState();

  if (mockConversation.length === 0) {
    return (
      <div className="py-3 px-3">
        <div className="flex z-20 items-center border-b border-b-paragraph/20 gap-4 fixed left-0 right-0  top-0 py-3 px-3">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>

          <h3 className="text-[22px] font-semibold">Messages</h3>
        </div>

        <div className="mt-24 pt-15 flex flex-col items-center justify-center px-4">
          <div className="bg-brand/10 p-5 rounded-full text-brand">
            <MessageCircleOff />
          </div>
          <h3 className="text-lg py-2 font-semibold">No message yet</h3>
          <p className="text-[14px] text-paragraph/90 text-center py-3">
            You haven't received any message from us yet. Message will appear
            here as soon as they arrive
          </p>

          <div className="px-3 w-full flex items-center flex-col justify-center mt-5">
            <span className="font-semibold">Need support?</span>

            <button
              onClick={() => {
                router.push(
                  "/messages/conversations-home/conversation-chat?type=support",
                );
              }}
              className="flex w-full justify-center py-2.5 px-4 bg-brand text-white rounded-full mt-4 items-center gap-2"
            >
              <MessageSquare size={18} color="#fff" />
              <span>Message us</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="py-3 px-3">
      <div className="flex z-20 items-center border-b border-b-paragraph/20 gap-4 fixed left-0 right-0  top-0 py-3 px-3">
        <button onClick={() => router.back()}>
          <ArrowLeft />
        </button>

        <h3 className="text-[22px] font-semibold">Messages</h3>
      </div>

      <div className="pt-15 px-1">
        <h3 className="text-paragraph/60 pb-5">last conversations</h3>

        <div className="flex flex-col gap-4">
          {mockConversation.map((cvt, idx) => (
            <div
              onClick={() => {
                router.push(
                  `/messages/conversations-home/conversation-chat?cid=${cvt.id}&type=support`,
                );
              }}
              key={cvt.id}
              className={`flex justify-between py-3 ${mockConversation.length - 1 !== idx && "border-b border-b-paragraph/10"}`}
            >
              <div className="flex gap-2 flex-1">
                <div
                  className={`bg-${ct_colors[cvt.type]} p-4 bg-brandDim/20 rounded-full self-start text-brand`}
                >
                  <Icon name={cvt.icon as keyof typeof Icon} size={20} />
                </div>
                <div className="leading-tight">
                  <h2 className="font-medium pb-1 text-[16px] leading-4">
                    {cvt.title}
                  </h2>
                  <p className="text-[14px] text-paragraph/70">
                    {cvt.msgSubject}
                  </p>
                  <p className="text-[13px] pt-1">{cvt.lastMsg}</p>
                </div>
              </div>

              <div className="shrink-0 flex-col flex gap-2 items-center  self-start">
                <span className="text-[12px] text-brand font-semibold ">
                  {formatOrderTime(cvt.timeAgo.toISOString(), false)}
                </span>
                {!cvt.isRead && (
                  <span className="text-[13px] bg-brand text-white rounded-full px-2 py-0.5">
                    {cvt.msgCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
