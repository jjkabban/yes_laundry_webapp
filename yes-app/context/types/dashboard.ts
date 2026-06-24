export type ActivePanelType =
  | "messages"
  | "notifications"
  | "orders"
  | "track"
  | null;

export type DashboardContextType = {
  panel: ActivePanelType;
  onPanelSelect: (panel: ActivePanelType) => void;
  onPanelClose: () => void;
  openPanel: boolean | undefined;
};
