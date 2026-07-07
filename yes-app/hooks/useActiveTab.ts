import { act, useCallback, useState } from "react";

export type ActiveTabType =
  | "home"
  | "orders"
  | "profile"
  | "logout"
  | "logo"
  | "notifications"
  | "messages";

export default function useActiveTab() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("home");

  const onTabChange = useCallback(
    (tab: ActiveTabType) => {
      setActiveTab(tab);
    },
    [activeTab],
  );

  return { activeTab, onTabChange };
}
