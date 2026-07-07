export type ActivePanelType =
  | "messages"
  | "notifications"
  | "orders"
  | "profile"
  | null;

export type DashboardContextType = {
  panel: ActivePanelType;
  onPanelSelect: (panel: ActivePanelType) => void;
  onPanelClose: () => void;
  openPanel: boolean | undefined;
};
