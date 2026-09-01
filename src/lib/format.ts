import { format, parseISO } from "date-fns";
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
