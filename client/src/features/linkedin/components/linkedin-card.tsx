import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LinkedInStatus } from "@/types/api";

const CONNECT_URL = "/api/auth/linkedin/start";

const dotClasses: Record<LinkedInStatus["status"], string> = {
  connected: "bg-success",
  expired: "bg-warning",
  not_connected: "bg-dot-off",
};

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
    <div className="min-w-0 pt-[18px] pr-2.5 pb-5 pl-0 md:pt-7 md:pr-7 md:pb-8">
      <div className="mb-3.5 flex size-8 items-center justify-center rounded-md bg-linkedin text-[13px] font-semibold text-white md:mb-8 md:size-10 md:text-base">
        in
      </div>
      <div className="mb-1.5 text-[15px] font-medium tracking-[-0.015em] text-foreground md:mb-2 md:text-xl md:tracking-[-0.02em]">
        LinkedIn
      </div>

      {status ? (
        <p
          className={cn(
            "mb-3 flex min-h-[26px] items-start gap-[5px] font-mono text-[10px] leading-[1.3] tracking-[0.02em] uppercase md:mb-5 md:min-h-0 md:items-center md:gap-[7px] md:text-[11px] md:leading-[normal] md:tracking-[0.04em]",
            isConnected ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "mt-[3px] size-1.5 shrink-0 rounded-full md:mt-0 md:size-[7px]",
              dotClasses[status.status],
            )}
          />
          {getStatusLabel(status)}
        </p>
      ) : (
        <p className="text-[13px] text-muted-foreground">
          {getStatusLabel(status)}
        </p>
      )}

      {actionLabel && (
        <Button
          asChild
          variant={isConnected ? "outline" : "default"}
          className={cn(
            "h-8 w-full px-0 text-xs font-medium md:h-9 md:w-auto md:px-3.5 md:text-[13px]",
            isConnected && "bg-card text-foreground dark:bg-card",
          )}
        >
          <a href={CONNECT_URL}>{actionLabel}</a>
        </Button>
      )}
    </div>
  );
}
