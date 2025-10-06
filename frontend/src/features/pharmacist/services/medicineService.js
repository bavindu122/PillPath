import { tokenUtils } from "../../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

function parseTitle(rawTitle) {
  if (!rawTitle) return { baseName: "Unknown", generic: "", full: rawTitle };
  // Extract portion before first '(' as base/brand and inside parentheses as generic actives
  const idx = rawTitle.indexOf("(");
  let baseName = rawTitle;
  let generic = "";
  if (idx !== -1) {
    baseName = rawTitle.substring(0, idx).trim();
    const closeIdx = rawTitle.indexOf(")", idx + 1);
    if (closeIdx !== -1) generic = rawTitle.substring(idx + 1, closeIdx).trim();
  }
  // Remove trailing dosage/forms after baseName if separated by comma and contains TABLET/CAPSULE etc.
  baseName = baseName
    .replace(/[,\s]+(TABLET|CAPSULE|SUSPENSION).*$/i, "")
    .trim();
  // Clean any trailing '[' (company section begins) if present
  baseName = baseName.replace(/\s*\[[^\]]*$/, "").trim();
  return { baseName, generic, full: rawTitle };
}

export const medicineService = {
  async search(name, page = 1, size = 20, { signal } = {}) {
    const url = `${API_BASE_URL}/medicines/search?name=${encodeURIComponent(
      name
    )}&page=${page}&size=${size}`;
    const res = await fetch(url, {
      headers: { ...tokenUtils.getAuthHeaders() },
      signal,
    });
    const contentType = res.headers.get("content-type");
    const body =
      contentType && contentType.includes("application/json")
        ? await res.json()
        : await res.text();
    if (!res.ok) {
      const msg = body && body.message ? body.message : `HTTP ${res.status}`;
      throw new Error(msg);
    }
    const items = body?.data?.items || [];
    // Map and group by baseName
    const grouped = {};
    items.forEach((item) => {
      const { baseName, generic, full } = parseTitle(item.title);
      if (!grouped[baseName]) grouped[baseName] = { baseName, variants: [] };
      grouped[baseName].variants.push({
        id: item.setId,
        setId: item.setId,
        baseName,
        title: full,
        genericName: generic,
        effectiveTime: item.effectiveTime,
        version: item.version,
      });
    });
    return {
      groups: Object.values(grouped),
      raw: items,
      page: body?.data?.page,
    };
  },
};
