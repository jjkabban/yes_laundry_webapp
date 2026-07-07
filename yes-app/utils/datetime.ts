export function formatOrderTime(iso: string, isPast: boolean): string {
  const date = new Date(iso);

  if (isPast) {
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  const diffMs = Date.now() - date.getTime();
  const totalSec = Math.floor(diffMs / 1000);
  const totalMin = Math.floor(totalSec / 60);
  const totalHr = Math.floor(totalMin / 60);
  const totalDay = Math.floor(totalHr / 24);

  if (totalSec < 10) return "just now";
  if (totalSec < 60) return `${totalSec}s ago`;
  if (totalMin < 60) return `${totalMin}m ${totalSec % 60}s ago`;
  if (totalHr < 24) return `${totalHr}h ${totalMin % 60}m ago`;
  return `${totalDay}d ${totalHr % 24}h ago`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  });
}

export function formatOrderWindowTime(iso: string, isPast: boolean): string {
  const date = new Date(iso);

  if (isPast) {
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  const diffMs = date.getTime() - Date.now();
  const totalSec = Math.floor(diffMs / 1000);
  const totalMin = Math.floor(totalSec / 60);
  const totalHr = Math.floor(totalMin / 60);
  const totalDay = Math.floor(totalHr / 24);

  if (diffMs < 0) return "Arriving any moment";
  if (totalMin < 60) return `Expected in ${totalMin}m`;
  if (totalHr < 24) return `Expected in ${totalHr}h ${totalMin % 60}m`;
  return `Expected in ${totalDay}d ${totalHr % 24}h`;
}
