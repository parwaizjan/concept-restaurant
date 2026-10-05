/**
 * Build-time fetch of the owner's Google Sheet into `src/data/menu-live.json`.
 *
 * Runs as `prebuild`. In runtime mode (the demo) it is a no-op. In build mode
 * (clones) it refreshes prices/availability/specials before the static build; on
 * failure it keeps the last-known-good file so a build never breaks because of the
 * Sheet.
 */
import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { site } from "../src/data/site";
import { getSheetCsvUrl, parseMenuSheet } from "../src/lib/sheet";

const here = dirname(fileURLToPath(import.meta.url));
const outputFile = resolve(here, "../src/data/menu-live.json");

async function main(): Promise<void> {
  const { mode, sheetId, sheetTab } = site.menu;

  if (mode !== "build" || !sheetId) {
    console.log(
      `[menu] skipping sheet fetch (mode=${mode}, sheetId=${
        sheetId ? "set" : "empty"
      })`,
    );
    return;
  }

  try {
    const response = await fetch(getSheetCsvUrl(sheetId, sheetTab));
    if (!response.ok) {
      throw new Error(`Sheet responded with HTTP ${response.status}`);
    }

    const menu = parseMenuSheet(await response.text());
    await writeFile(outputFile, `${JSON.stringify(menu, null, 2)}\n`, "utf8");
    console.log(
      `[menu] wrote ${Object.keys(menu).length} rows to menu-live.json`,
    );
  } catch (error) {
    console.warn(
      "[menu] sheet fetch failed; keeping last-known-good menu-live.json",
      error,
    );
  }
}

void main();
