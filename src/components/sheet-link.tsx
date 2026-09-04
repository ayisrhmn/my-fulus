"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type Props = Omit<ComponentProps<"a">, "href"> & {
  basePath: string;
  sheet: string;
};

/**
 * Opens a CRUD sheet by setting `?sheet=`. When already on the route that owns
 * the sheet, it swaps the query param via the History API so Next doesn't
 * re-run the server component — the sheet opens instantly and the back button
 * closes it. From another route it falls back to a normal navigation.
 */
export function SheetLink({ basePath, sheet, onClick, ...props }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const href = `${basePath}?sheet=${sheet}`;

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    e.preventDefault();
    if (pathname === basePath) {
      window.history.pushState(null, "", href);
    } else {
      router.push(href, { scroll: false });
    }
  }

  return <a href={href} onClick={handleClick} {...props} />;
}
