import { wrapError } from "./errors.js";
import type { GInstance } from "./types.js";
import { normalizeInstance } from "./normalize.js";

export async function getInstance(masto: any): Promise<GInstance> {
  try {
    // Prefer v2 instance endpoint when available.
    const raw = masto?.v2?.instance?.fetch
      ? await masto.v2.instance.fetch()
      : await masto?.v1?.instance?.fetch?.();

    return normalizeInstance(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "instance.get failed");
  }
}
