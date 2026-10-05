# Reservation flow (WhatsApp)

This is the feature the whole concept exists to sell. Read it before touching
`src/lib/reservation.ts`, `src/lib/whatsapp.ts`, `src/scripts/reservation.ts`, or
the `reserve/*` components.

## 1. Principles

- **No backend, no payment, no account, no calendar.** The request is a message,
  not a booking.
- **Enquiry only.** The date, time and party size shown are a wish list; the owner
  confirms the actual table in the chat.
- **No availability check.** Preferred time slots are a wish list, not a promise.
- **Mobile-first.** Assume the visitor is on a phone, arriving from a Facebook,
  Instagram or WhatsApp link.
- **Never lose the request.** The selection survives a page reload
  (`sessionStorage`) and the WhatsApp link contains the full request, so even if the
  tab closes nothing is lost.

## 2. The flow

```text
Browse the menu (/menu or /)
   │  tap "Reserve a table"
   ▼
Reserve page (/reserve)
   ├─ Party size: 1–8 stepper
   │     └─ 9+ → a "Reserve for a larger group" WhatsApp enquiry button instead
   ├─ Date: native date input (within lead-time window)
   ├─ Time: one preferred slot (chips)
   ├─ Occasion (optional)
   ├─ Name (optional)
   ├─ Phone (optional)
   └─ Notes (optional)
   │  "Send request on WhatsApp"
   ▼
wa.me/<owner-number>?text=<url-encoded reservation message>
   │
   ▼
Owner's WhatsApp opens with the request pre-filled.
```

Entry points to `/reserve`: header CTA, hero primary button, signature dish cards,
the Specials strip, and the mobile sticky bar. The sticky bar is the primary mobile
action (see `DECISIONS.md` D-R17).

## 3. Message format

Built by `src/lib/reservation.ts`, delivered by `src/lib/whatsapp.ts`. Keep it plain
text, unambiguous on a phone, and localized where it does not confuse the owner.

```text
Hi Spice & Ember! I'd like to reserve a table.

*Party size*: 4
*Preferred date*: Sat 10 Oct 2026
*Preferred time*: 20:00
*Occasion*: Birthday
*Name*: Nimal Perera
*Phone*: +94 71 234 5678
*Notes*: Window table if possible.

Please confirm availability. Thank you!
```

- Use `*bold*` (WhatsApp markdown) for the field labels.
- Party size is a plain number (e.g. `4`).
- Date uses a clear, unambiguous format (`Sat 10 Oct 2026`) via
  `Intl.DateTimeFormat`.
- Time is 24h (`20:00`). If no time is picked, write `Any time` (localized).
- Omit optional lines (`Occasion`, `Name`, `Phone`, `Notes`) when blank.
- Numbers are encoded with `encodeURIComponent`; `\n` becomes `%0A`.
- The configured number is digits with country code (`94743430033`), never `+`.

## 4. Party size and rules

- Party size is **1–8**, chosen with a stepper (`reserve/PartySizeStepper`). No
  quantities of dishes — this is a table request, not an order.
- Selecting **9 or more** (or tapping "larger group") does **not** submit the form.
  Instead the page swaps in a **"Reserve for a larger group"** button that opens
  WhatsApp with a short enquiry message (no party/date assumed) so the owner can
  discuss it. See §5.
- Party size defaults to **2**.
- The form is valid with only a party size: date/time are optional wish-list fields.
- A generic "Chat on WhatsApp" link is always available even without JS.

## 5. Larger-group enquiry

When the visitor indicates a party larger than `site.reservation.maxPartySize`
(default 8), the form is replaced (or the submit button disabled) and the
larger-group button is shown. Its message is deliberately short:

```text
Hi Spice & Ember! I'd like to enquire about a table for a larger group (more than 8).

*Name*: Nimal Perera
*Notes*: Around 12 people, Saturday evening if possible.

Please let me know if you can accommodate us. Thank you!
```

- The button is visible from the start with copy explaining that groups over 8 are
  arranged directly.
- The exact threshold is `site.reservation.maxPartySize`; components must not
  hardcode `8`.

## 6. Date and time picker

- **Date:** a native `<input type="date">` that is **calendar-only** — manual
  typing is blocked and clicking the field opens the native picker
  (`showPicker()`). `min`/`max` are computed **client-side** from the visitor's
  today (`today + minLeadDays` … `today + maxLeadDays`, defaults 0 and 90), so past
  dates and out-of-range dates can't be chosen and a submitted date outside the
  window is dropped. The field is **prefilled** with the next open day: today before
  noon, otherwise tomorrow, advanced past closed weekdays (from `site.hours`). No
  availability is implied. Without JS, the build-time `min`/`max` apply as a
  fallback.
- **Time:** single-select chips generated from `site.reservation.slots` (lunch and
  dinner windows). One preferred time only (per user direction, D-R06). An
  "Any time" option (localized) is always offered.
- **Occasion:** optional chips/select from `site.reservation.occasions`
  (`none`, `birthday`, `anniversary`, `business`, `celebration`); `none` is omitted
  from the message.
- The picker never blocks sending: a request with only a party size is still valid
  (the date is normally prefilled).
- Formatting is locale-aware; the message uses a clear, unambiguous date.
- Controls are real form controls with labels, keyboard operable, and usable without
  JS. Without JS, the Reserve page renders a generic WhatsApp link (party size and
  date can still be mentioned in the chat).

## 7. Configuration

- Owner WhatsApp number: `site.whatsappNumber` in `src/data/site.ts`.
- Party cap, lead time, time slots, occasions: `site.reservation`.
- Message template and labels: `src/i18n/ui.ts` (all enabled languages).
- Menu data and specials: `src/lib/menu.ts` (collections + Sheet).

## 8. Verification (smoke test)

After any change to the flow, manually verify on a phone-sized viewport:

1. Default party size is 2; step up/down within 1–8.
2. Set the party size to 9 (or tap "larger group"); confirm the normal form is not
   submitted and the larger-group enquiry button appears with the correct message.
3. Confirm the date is prefilled with the next open day (today before noon,
   otherwise the next non-closed day), and that typing into the date field does
   nothing while clicking it opens the picker.
4. Pick a date and one time slot; then clear the date and send a request without
   one (still valid).
5. Choose an occasion; confirm it appears in the message. Choose "none"; confirm it
   is omitted.
6. Leave name/phone/notes blank; the message omits those lines.
7. Reload the page — the selection persists.
8. Tap send; WhatsApp opens with a correctly formatted, correctly encoded message,
   to the configured number, in the selected language.
9. Disable JavaScript; confirm the page still offers a usable WhatsApp entry point.

If a Playwright smoke test is added later, automate steps 1–8 and document it in
`AGENTS.md`.
