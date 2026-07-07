"use client";

import Icon from "@/components/icons/LucideIcons";
import { ArrowLeft, Send, X } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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

type MessagesType = {
  id: string;
  replyMsg: string;
  sentMsg: string;
  sender: { name: string };
  deliveredAt: Date;
  sendAt: Date;
  attachedMedia: string | null;
};
type ConversationMessageType = {
  conversationId: string;
  title: string;
  icon: string;
  subject: string;
  messages: MessagesType[];
};

const mockMessages: ConversationMessageType = {
  conversationId: "eikdkkjakjdj",
  title: "Customer support",
  icon: "Info",
  subject: "Order #3495h",
  messages: [
    {
      id: "hiee233hdidi",
      sendAt: new Date(),
      sender: { name: "Justice" },
      deliveredAt: new Date(),
      sentMsg: "Hello please can I get help on this",
      replyMsg: "Yes so you need to order directly on our platform",
      attachedMedia: "",
    },
    {
      id: "hdiie34eiey",
      sendAt: new Date(),
      sender: { name: "Justice" },
      deliveredAt: new Date(),
      sentMsg: "Hello please can I get help on this",
      replyMsg: "Yes so you need to order directly on our platform",
      attachedMedia: "",
    },
    {
      id: "hdiie34eiey2",
      sendAt: new Date(),
      sender: { name: "Justice" },
      deliveredAt: new Date(),
      sentMsg: "Hello please can I get help on this",
      replyMsg: "Yes so you need to order directly on our platform",
      attachedMedia: "",
    },
  ],
};

const images = ["/images/user1.jpg", "/images/user2.jpg", "/images/user3.jpg"];

// A single rendered bubble in the timeline. We split each MessagesType record
// (which carries both the customer's message and the support reply) into two
// bubbles so they can be rendered in order on opposite sides of the thread.
type Bubble = {
  id: string;
  from: "me" | "them";
  text: string;
  at: Date;
};

function flattenMessages(messages: MessagesType[]): Bubble[] {
  return messages.flatMap((m) => [
    { id: `${m.id}-sent`, from: "me" as const, text: m.sentMsg, at: m.sendAt },
    {
      id: `${m.id}-reply`,
      from: "them" as const,
      text: m.replyMsg,
      at: m.deliveredAt,
    },
  ]);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ConversationChat() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("cid");

  const conversation = useMemo(() => {
    return mockMessages.conversationId === id ? mockMessages : mockMessages;
  }, [id]);

  const [bubbles, setBubbles] = useState<Bubble[]>(() =>
    flattenMessages(conversation.messages),
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the thread pinned to the latest message whenever bubbles change.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [bubbles]);

  // Mobile-keyboard-safe layout: track the visual viewport height in a CSS
  // variable instead of relying on 100vh / fixed alone, which drift on
  // iOS/Android when the keyboard opens.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const setVar = () => {
      document.documentElement.style.setProperty("--app-vh", `${vv.height}px`);
    };

    setVar();
    vv.addEventListener("resize", setVar);
    vv.addEventListener("scroll", setVar);
    return () => {
      vv.removeEventListener("resize", setVar);
      vv.removeEventListener("scroll", setVar);
    };
  }, []);

  // Prevent the document itself from scrolling while the input is focused,
  // which is what tends to drag "fixed" elements around on iOS Safari.
  const handleFocus = () => {
    document.body.style.overflow = "hidden";
  };
  const handleBlur = () => {
    document.body.style.overflow = "";
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    setSending(true);
    const optimistic: Bubble = {
      id: `local-${Date.now()}`,
      from: "me",
      text,
      at: new Date(),
    };
    setBubbles((prev) => [...prev, optimistic]);
    setDraft("");

    try {
      // TODO: replace with real API call, e.g.
      // await fetch(`/api/conversations/${conversation.conversationId}/messages`, {
      //   method: "POST",
      //   body: JSON.stringify({ text }),
      // });
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "var(--app-vh, 100dvh)" }}>
      {/* Header */}
      <div className="flex shrink-0 sticky top-0 left-0 right-0 w-full z-80 bg-bgBase justify-between px-3 py-3 border-b-paragraph/20 border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} aria-label="Go back">
            <ArrowLeft />
          </button>

          <div className="flex items-center gap-3 leading-tight">
            <div className="p-3 bg-brand/10 rounded-full">
              <Icon name={conversation.icon as keyof typeof Icon} size={18} />
            </div>
            <div className="leading-4">
              <h2 className="font-medium text-[18px]">{conversation.title}</h2>
              <p className="text-sm text-paragraph/60">
                {conversation.subject}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex">
            {images.map((img, idx) => (
              <div
                key={img + idx}
                className={`relative h-${7 - idx} w-${7 - idx} rounded-full overflow-hidden border-black border-2`}
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
        </div>
      </div>

      {/* Message thread */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
      >
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={`flex ${
              bubble.from === "me" ? "justify-end py-2" : "justify-start py-2"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-snug ${
                bubble.from === "me"
                  ? "bg-brand text-white rounded-br-sm"
                  : "bg-paragraph/10 text-paragraph rounded-bl-sm"
              }`}
            >
              <p>{bubble.text}</p>
              <span
                className={`mt-1 block text-[10px] ${
                  bubble.from === "me" ? "text-white/70" : "text-paragraph/50"
                }`}
              >
                {formatTime(bubble.at)}
              </span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="shrink-0 px-4 py-4 border-t border-paragraph/20 bg-bgBase">
        <div className="flex items-center gap-2 border border-paragraph/30 rounded-full px-4 h-12">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Type a message..."
            className="flex-1 h-full bg-transparent outline-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            aria-label="Send message"
            className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-brand text-white disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
