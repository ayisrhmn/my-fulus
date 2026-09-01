import {
  Banknote,
  Briefcase,
  Car,
  Clapperboard,
  CreditCard,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Minus,
  PiggyBank,
  Pill,
  Plane,
  Plus,
  Receipt,
  ShoppingBag,
  Tag,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";

// Explicit whitelist keeps the bundle small (importing all of lucide is ~1MB).
const map: Record<string, LucideIcon> = {
  banknote: Banknote,
  briefcase: Briefcase,
  car: Car,
  clapperboard: Clapperboard,
  "credit-card": CreditCard,
  gift: Gift,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  home: Home,
  minus: Minus,
  "piggy-bank": PiggyBank,
  pill: Pill,
  plane: Plane,
  plus: Plus,
  receipt: Receipt,
  "shopping-bag": ShoppingBag,
  "utensils-crossed": UtensilsCrossed,
  wallet: Wallet,
};

export const CATEGORY_ICON_NAMES = Object.keys(map);

export function CategoryIcon({
  name,
  className = "size-5",
}: {
  name: string | null;
  className?: string;
}) {
  const Icon = (name && map[name]) || Tag;
  return <Icon className={className} />;
}
