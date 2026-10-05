/**
 * Client reservation engine: party size, preferred date/time, Google Sheet
 * refresh, and the WhatsApp hand-off.
 *
 * Plain DOM + sessionStorage, no framework. Runs on every page so the menu can
 * refresh live prices and the sticky bar stays in sync; the reservation form only
 * exists on `/reserve`. All restaurant-specific values and UI strings arrive
 * through the `#reservation-config` JSON block rendered by `BaseLayout`.
 */
import { formatPrice } from "../lib/format";
import { getSheetCsvUrl, parseMenuSheet } from "../lib/sheet";
import {
  buildGroupEnquiryMessage,
  buildReservationMessage,
  type ReservationDetails,
} from "../lib/reservation";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import type { Locale } from "../data/site";
import type { UiKey } from "../i18n/ui";

type ReservationConfig = {
  whatsappNumber: string;
  siteName: string;
  lang: string;
  i18n: Record<string, string>;
  menu: {
    mode: "runtime" | "build";
    sheetId: string;
    sheetTab: string;
    refreshMinutes: number;
  };
  reservation: {
    slots: string[];
    minLeadDays: number;
    maxLeadDays: number;
    maxPartySize: number;
    hours: { day: number; open: string; close: string }[];
  };
};

type SavedState = {
  partySize?: number;
  date?: string;
  slot?: string;
  occasion?: string;
  name?: string;
  phone?: string;
  notes?: string;
};

const STORAGE_KEY = "spice-ember-reservation-v1";
const CACHE_KEY = "spice-ember-menu-sheet-v1";

/** Local ISO `yyyy-mm-dd` (no timezone shift, unlike `toISOString`). */
function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function readConfig(): ReservationConfig | null {
  const node = document.getElementById("reservation-config");
  if (!node?.textContent) return null;
  try {
    return JSON.parse(node.textContent) as ReservationConfig;
  } catch {
    return null;
  }
}

function loadState(): SavedState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedState) : {};
  } catch {
    return {};
  }
}

function saveState(state: SavedState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable; state stays in-memory for this page view */
  }
}

class ReservationApp {
  private config: ReservationConfig;
  private t: (key: UiKey) => string;
  private maxParty: number;
  private partySize: number;
  private dateInput: HTMLInputElement | null = null;
  private minIso = "";
  private maxIso = "";

  constructor(config: ReservationConfig) {
    this.config = config;
    this.t = (key) => this.config.i18n[key] ?? key;
    this.maxParty = Math.max(1, config.reservation.maxPartySize);
    this.partySize = 2;
  }

  init(): void {
    const saved = loadState();
    if (typeof saved.partySize === "number") {
      this.partySize = this.clamp(saved.partySize);
    }

    this.restore(saved);
    this.bind();

    const form = document.querySelector<HTMLFormElement>(
      "[data-reservation-form]",
    );
    if (form) {
      this.dateInput = form.querySelector<HTMLInputElement>("[data-date]");
      this.renderParty();
      this.bindFormPersistence();
      this.setupDate();
    }

    this.updateOpenNow();
    void this.refreshFromSheet();
  }

  /**
   * The date input is calendar-only (native typing is suppressed), constrained to
   * `[today + minLeadDays, today + maxLeadDays]`, and prefilled with the next open
   * day: today before noon, otherwise tomorrow; closed days are skipped.
   */
  private setupDate(): void {
    const input = this.dateInput;
    if (!input) return;

    const { minLeadDays, maxLeadDays } = this.config.reservation;
    const now = new Date();
    const start = addDays(now, minLeadDays);
    const end = addDays(now, maxLeadDays);

    this.minIso = toIso(start);
    this.maxIso = toIso(end);
    input.min = this.minIso;
    input.max = this.maxIso;

    if (!input.value) {
      let base = now.getHours() >= 12 ? addDays(now, 1) : now;
      if (base < start) base = start;
      input.value = toIso(this.nextOpenDay(base));
    }

    // Block keyboard entry so the native picker is the only way to set a date.
    input.addEventListener("keydown", (event) => {
      if (["Tab", "Shift", "Escape"].includes(event.key)) return;
      event.preventDefault();
    });

    input.addEventListener("click", (event) => {
      const picker = input as HTMLInputElement & { showPicker?: () => void };
      if (typeof picker.showPicker === "function") {
        event.preventDefault();
        try {
          picker.showPicker();
        } catch {
          /* ignore: some browsers require a direct gesture */
        }
      }
    });
  }

  /** Advance to the next day the restaurant is open (skips closed weekdays). */
  private nextOpenDay(date: Date): Date {
    const next = new Date(date);
    for (let i = 0; i < 14; i++) {
      const hours = this.config.reservation.hours.find(
        (entry) => entry.day === next.getDay(),
      );
      if (hours && hours.open) return next;
      next.setDate(next.getDate() + 1);
    }
    return date;
  }

  private clamp(value: number): number {
    if (!Number.isFinite(value)) return 2;
    return Math.min(this.maxParty, Math.max(1, Math.round(value)));
  }

  private persist(): void {
    const form = document.querySelector<HTMLFormElement>(
      "[data-reservation-form]",
    );
    const state: SavedState = { partySize: this.partySize };

    const date = form?.querySelector<HTMLInputElement>("[data-date]")?.value;
    if (date) state.date = date;

    const slot = form?.querySelector<HTMLInputElement>(
      'input[name="slot"]:checked',
    )?.value;
    if (slot) state.slot = slot;

    const occasion =
      form?.querySelector<HTMLSelectElement>("[data-occasion]")?.value;
    if (occasion) state.occasion = occasion;

    const name = form?.querySelector<HTMLInputElement>("[data-name]")?.value;
    if (name) state.name = name;

    const phone = form?.querySelector<HTMLInputElement>("[data-phone]")?.value;
    if (phone) state.phone = phone;

    const notes =
      form?.querySelector<HTMLTextAreaElement>("[data-notes]")?.value;
    if (notes) state.notes = notes;

    saveState(state);
  }

  private restore(saved: SavedState): void {
    const form = document.querySelector<HTMLFormElement>(
      "[data-reservation-form]",
    );
    if (!form) return;

    if (saved.date) {
      const date = form.querySelector<HTMLInputElement>("[data-date]");
      if (date) date.value = saved.date;
    }

    if (saved.slot) {
      const slot = form.querySelector<HTMLInputElement>(
        `input[name="slot"][value="${CSS.escape(saved.slot)}"]`,
      );
      if (slot) slot.checked = true;
    }

    if (saved.occasion) {
      const occasion = form.querySelector<HTMLSelectElement>("[data-occasion]");
      if (occasion) occasion.value = saved.occasion;
    }

    if (saved.name) {
      const name = form.querySelector<HTMLInputElement>("[data-name]");
      if (name) name.value = saved.name;
    }

    if (saved.phone) {
      const phone = form.querySelector<HTMLInputElement>("[data-phone]");
      if (phone) phone.value = saved.phone;
    }

    if (saved.notes) {
      const notes = form.querySelector<HTMLTextAreaElement>("[data-notes]");
      if (notes) notes.value = saved.notes;
    }
  }

  private renderParty(): void {
    const valueNode = document.querySelector<HTMLElement>("[data-party-value]");
    const input =
      document.querySelector<HTMLInputElement>("[data-party-input]");
    const decrease = document.querySelector<HTMLButtonElement>(
      "[data-party-decrease]",
    );
    const increase = document.querySelector<HTMLButtonElement>(
      "[data-party-increase]",
    );

    if (valueNode) valueNode.textContent = String(this.partySize);
    if (input) input.value = String(this.partySize);
    if (decrease) decrease.disabled = this.partySize <= 1;
    if (increase) increase.disabled = this.partySize >= this.maxParty;
  }

  private setParty(next: number): void {
    this.partySize = this.clamp(next);
    this.renderParty();
    this.persist();
  }

  private bind(): void {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-party-decrease]")) {
        this.setParty(this.partySize - 1);
        return;
      }

      if (target.closest("[data-party-increase]")) {
        this.setParty(this.partySize + 1);
        return;
      }

      if (target.closest("[data-larger-send]")) {
        this.sendGroup();
      }
    });

    const form = document.querySelector<HTMLFormElement>(
      "[data-reservation-form]",
    );
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.send(form);
    });
  }

  private bindFormPersistence(): void {
    const form = document.querySelector<HTMLFormElement>(
      "[data-reservation-form]",
    );
    if (!form) return;

    form.addEventListener("change", () => this.persist());
    form.addEventListener("input", () => this.persist());
  }

  private readDetails(
    form: HTMLFormElement | null,
  ): ReservationDetails & { occasion?: string } {
    const slot = form?.querySelector<HTMLInputElement>(
      'input[name="slot"]:checked',
    )?.value;

    const rawDate =
      form?.querySelector<HTMLInputElement>("[data-date]")?.value || undefined;
    const date =
      rawDate &&
      (!this.minIso || (rawDate >= this.minIso && rawDate <= this.maxIso))
        ? rawDate
        : undefined;

    return {
      partySize: this.partySize,
      date,
      slot: slot && slot !== "any" ? slot : undefined,
      occasion:
        form?.querySelector<HTMLSelectElement>("[data-occasion]")?.value ||
        undefined,
      name: form?.querySelector<HTMLInputElement>("[data-name]")?.value,
      phone: form?.querySelector<HTMLInputElement>("[data-phone]")?.value,
      notes: form?.querySelector<HTMLTextAreaElement>("[data-notes]")?.value,
    };
  }

  private send(form: HTMLFormElement): void {
    const details = this.readDetails(form);
    const message = buildReservationMessage(
      details,
      this.config.lang as Locale,
      this.t,
    );
    this.open(message);
  }

  private sendGroup(): void {
    const form = document.querySelector<HTMLFormElement>(
      "[data-reservation-form]",
    );
    const details = this.readDetails(form);
    const message = buildGroupEnquiryMessage(
      { name: details.name, phone: details.phone, notes: details.notes },
      this.t,
    );
    this.open(message);
  }

  private open(message: string): void {
    window.open(
      buildWhatsAppUrl(message, this.config.whatsappNumber),
      "_blank",
      "noopener,noreferrer",
    );
  }

  private updateOpenNow(): void {
    const badge = document.querySelector<HTMLElement>("[data-open-badge]");
    if (!badge) return;

    const rows = Array.from(
      document.querySelectorAll<HTMLElement>("[data-hours-day]"),
    );
    if (rows.length === 0) return;

    const now = new Date();
    const today = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const toMinutes = (value: string): number => {
      const [h, m] = value.split(":").map(Number);
      return (h ?? 0) * 60 + (m ?? 0);
    };

    const row = rows.find((r) => Number(r.dataset.hoursDay) === today);
    let open = false;
    if (row?.dataset.hoursOpen && row?.dataset.hoursClose) {
      const start = toMinutes(row.dataset.hoursOpen);
      const end = toMinutes(row.dataset.hoursClose);
      open = minutes >= start && minutes < end;
    }

    badge.textContent = open
      ? this.t("visit.openNow")
      : this.t("visit.closedNow");
    badge.className = `badge ${open ? "bg-success text-white" : "bg-danger text-white"}`;
    badge.hidden = false;
  }

  private async refreshFromSheet(): Promise<void> {
    const { mode, sheetId, sheetTab, refreshMinutes } = this.config.menu;
    if (mode !== "runtime" || !sheetId) return;

    const sheet = await this.fetchSheet(sheetId, sheetTab, refreshMinutes);
    if (!sheet) return;

    for (const [id, row] of Object.entries(sheet)) {
      const selector = CSS.escape(id);
      const hosts = document.querySelectorAll<HTMLElement>(
        `[data-dish][data-id="${selector}"], [data-special-card][data-id="${selector}"]`,
      );

      hosts.forEach((host) => {
        if (typeof row.price === "number") {
          host.dataset.price = String(row.price);
          host
            .querySelectorAll<HTMLElement>("[data-price-display]")
            .forEach((node) => {
              node.textContent = formatPrice(row.price as number);
            });
        }

        const dish = host.matches("[data-dish]") ? host : null;
        if (!dish) return;

        if (typeof row.available === "boolean") {
          dish.dataset.available = String(row.available);
          dish.classList.toggle("opacity-60", !row.available);
          const unavailable =
            dish.querySelector<HTMLElement>("[data-unavailable]");
          if (unavailable) unavailable.hidden = row.available;
        }

        if (typeof row.special === "boolean") {
          dish.dataset.special = String(row.special);
          const badge = dish.querySelector<HTMLElement>("[data-special-badge]");
          if (badge) badge.hidden = !row.special;
        }
      });
    }
  }

  private async fetchSheet(
    sheetId: string,
    sheetTab: string,
    refreshMinutes: number,
  ) {
    const cacheKey = `${CACHE_KEY}:${sheetId}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as { at: number; data: unknown };
        if (Date.now() - parsed.at < refreshMinutes * 60_000) {
          return parsed.data as ReturnType<typeof parseMenuSheet>;
        }
      }
    } catch {
      /* ignore cache errors */
    }

    try {
      const response = await fetch(getSheetCsvUrl(sheetId, sheetTab));
      if (!response.ok) return null;
      const data = parseMenuSheet(await response.text());
      try {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ at: Date.now(), data }),
        );
      } catch {
        /* ignore cache write errors */
      }
      return data;
    } catch {
      return null;
    }
  }
}

const config = readConfig();
if (config) {
  new ReservationApp(config).init();
}
