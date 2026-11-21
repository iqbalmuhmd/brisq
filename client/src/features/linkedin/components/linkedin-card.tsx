import { Button } from "@/components/ui/button";
import type { LinkedInStatus } from "@/types/api";

const CONNECT_URL = "/api/auth/linkedin/start";

function getStatusLabel(status: LinkedInStatus | null) {
  if (!status) return "Couldn't load your status. Refresh to try again.";
  if (status.status === "connected") return "Connected";
  if (status.status === "expired") return "Connection expired";
  return "Not connected";
}

export function LinkedInCard({ status }: { status: LinkedInStatus | null }) {
  const isConnected = status?.status === "connected";
  const actionLabel =
    status === null
      ? null
      : status.status === "not_connected"
        ? "Connect"
        : "Reconnect";

  return (
    <div className="mt-4">
      <div>LinkedIn</div>
      <p className="text-muted-foreground">{getStatusLabel(status)}</p>

      {actionLabel && (
        <Button asChild variant={isConnected ? "outline" : "default"}>
          <a href={CONNECT_URL}>{actionLabel}</a>
        </Button>
      )}
    </div>
  );
}
