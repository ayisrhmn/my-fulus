import { ChevronRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SettingsRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="block w-full text-left">
      <Card className="flex items-center gap-3">
        <Icon className="size-4 shrink-0 text-text-muted" />
        <span className="flex-1 font-medium">{label}</span>
        <ChevronRight className="size-4 shrink-0 text-text-muted" />
      </Card>
    </button>
  );
}
