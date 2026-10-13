import { site } from "../data/site";

/**
 * Build a wa.me deep link. The number must be digits only (country code, no `+`).
 * Every WhatsApp entry point routes through here — never inline `wa.me` URLs in
 * components.
 */
export function buildWhatsAppUrl(
  message: string,
  number: string = site.whatsappNumber,
): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Prefix a visitor-facing demo message with the source tag so the restaurant can
 * tell it apart from a website enquiry. Central helper — all demo CTAs go through
 * here. Empty/whitespace `site.demo.sourceTag` (a real clone) is a no-op.
 */
export function tagDemoMessage(message: string): string {
  const tag = site.demo.sourceTag.trim();
  return tag ? `${tag} ${message}` : message;
}

/** WhatsApp link for a tagged demo visitor CTA (reservation, enquiry, contact). */
export function buildDemoWhatsAppUrl(
  message: string,
  number: string = site.whatsappNumber,
): string {
  return buildWhatsAppUrl(tagDemoMessage(message), number);
}
