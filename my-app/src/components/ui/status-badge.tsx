import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status =
  | "completed"
  | "transfer-successful"
  | "transfer-attempted"
  | "callback-requested"
  | "not-reached"
  | "voicemail"
  | "looking"
  | "active"
  | "pending"
  | "future";

const statusConfig: Record<
  Status,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  "transfer-successful": {
    label: "Transfer Successful",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  },
  "transfer-attempted": {
    label: "Transfer Attempted",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  },
  "callback-requested": {
    label: "Callback Requested",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  "not-reached": {
    label: "Not Reached",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  },
  voicemail: {
    label: "Voicemail",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  },
  looking: {
    label: "Looking",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  pending: {
    label: "Pending",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  },
  future: {
    label: "Future",
    className: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
