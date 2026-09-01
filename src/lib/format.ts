import { format, isToday, isYesterday, parseISO } from "date-fns";
import { id } from "date-fns/locale";

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatIDR(amount: number) {
  return idr.format(amount);
}

// date is a yyyy-MM-dd string.
export function formatDate(date: string) {
  return format(parseISO(date), "d MMM yyyy", { locale: id });
}

export function formatDateHeader(date: string) {
  const d = parseISO(date);
  if (isToday(d)) return "Hari ini";
  if (isYesterday(d)) return "Kemarin";
  return format(d, "EEEE, d MMM yyyy", { locale: id });
}
