import { site, type Locale } from "../data/site";
import type { UiKey } from "../i18n/ui";

export type ReservationDetails = {
  partySize: number;
  /** ISO `yyyy-mm-dd`, if the visitor picked a preferred date. */
  date?: string;
  /** Preferred time ("HH:MM"); empty means any time. */
  slot?: string;
  /** Occasion key from `site.reservation.occasions`, or "none". */
  occasion?: string;
  name?: string;
  phone?: string;
  notes?: string;
};

type Translate = (key: UiKey) => string;

/** Format an ISO date as a clear, unambiguous label, e.g. `Sat 10 Oct 2026`. */
export function formatPreferredDate(iso: string, lang: Locale): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;

  const locale = lang === "en" ? "en-GB" : `${lang}-LK`;
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
    .format(new Date(year, month - 1, day))
    .replace(/,/g, "");
}

/**
 * Build the plain-text WhatsApp reservation message. Keep it human-readable on a
 * phone and use WhatsApp `*bold*` markup.
 */
export function buildReservationMessage(
  details: ReservationDetails,
  lang: Locale,
  t: Translate,
): string {
  const parts: string[] = [`Hello ${site.name}! ${t("msg.intro")}`, ""];

  parts.push(`*${t("msg.partySize")}*: ${details.partySize}`);

  if (details.date) {
    parts.push(
      `*${t("msg.date")}*: ${formatPreferredDate(details.date, lang)}`,
    );
  }

  const timeText = details.slot ? details.slot : t("msg.timeAny");
  parts.push(`*${t("msg.time")}*: ${timeText}`);

  if (details.occasion && details.occasion !== "none") {
    parts.push(
      `*${t("msg.occasion")}*: ${t(`occasion.${details.occasion}` as UiKey)}`,
    );
  }

  if (details.name?.trim()) {
    parts.push(`*${t("msg.name")}*: ${details.name.trim()}`);
  }

  if (details.phone?.trim()) {
    parts.push(`*${t("msg.phone")}*: ${details.phone.trim()}`);
  }

  if (details.notes?.trim()) {
    parts.push(`*${t("msg.notes")}*: ${details.notes.trim()}`);
  }

  parts.push("", t("msg.footer"));
  return parts.join("\n");
}

/**
 * Shorter message for parties larger than `site.reservation.maxPartySize`. The
 * owner arranges the details in chat; no party size is assumed.
 */
export function buildGroupEnquiryMessage(
  details: Pick<ReservationDetails, "name" | "phone" | "notes">,
  t: Translate,
): string {
  const parts: string[] = [`Hello ${site.name}! ${t("msg.groupIntro")}`, ""];

  if (details.name?.trim()) {
    parts.push(`*${t("msg.name")}*: ${details.name.trim()}`);
  }

  if (details.phone?.trim()) {
    parts.push(`*${t("msg.phone")}*: ${details.phone.trim()}`);
  }

  if (details.notes?.trim()) {
    parts.push(`*${t("msg.notes")}*: ${details.notes.trim()}`);
  }

  parts.push("", t("msg.groupFooter"));
  return parts.join("\n");
}
