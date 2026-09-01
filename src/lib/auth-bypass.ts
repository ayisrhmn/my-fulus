// Dev-only escape hatch: skip auth guards when locked out (e.g. magic-link
// email rate limit). Never active in production.
export const authDisabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
