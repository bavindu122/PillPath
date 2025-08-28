// Simple aggregated cart using sessionStorage
const KEY = "pp.AggregatedCart.v1";

export function getCart() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

export function saveCart(cart) {
  sessionStorage.setItem(KEY, JSON.stringify(cart || { items: [] }));
}

export function clearCart() {
  sessionStorage.removeItem(KEY);
}

export function addItems(newItems = []) {
  const cart = getCart();
  const map = new Map();
  // key by id+pharmacyName+prescriptionId to avoid duplicates
  for (const it of cart.items) {
    const k = `${it.id}|${it.pharmacyName || ""}|${it.prescriptionId || ""}`;
    map.set(k, it);
  }
  for (const it of newItems) {
    const k = `${it.id}|${it.pharmacyName || ""}|${it.prescriptionId || ""}`;
    if (map.has(k)) {
      const prev = map.get(k);
      map.set(k, {
        ...prev,
        quantity: (prev.quantity || 1) + (it.quantity || 1),
      });
    } else {
      map.set(k, { ...it, quantity: it.quantity || 1 });
    }
  }
  cart.items = Array.from(map.values());
  saveCart(cart);
  return cart;
}

export function getItems() {
  return getCart().items;
}

export function getItemsByPrescription(prescriptionId) {
  const items = getCart().items;
  return prescriptionId
    ? items.filter((it) => it.prescriptionId === prescriptionId)
    : items;
}

export function clearPrescription(prescriptionId) {
  if (!prescriptionId) return;
  const cart = getCart();
  cart.items = (cart.items || []).filter(
    (it) => it.prescriptionId !== prescriptionId
  );
  saveCart(cart);
}

export function setItemsForPrescriptionAndPharmacy(
  prescriptionId,
  pharmacyName,
  items
) {
  const cart = getCart();
  const normPh = (pharmacyName || "").toString();
  const rest = (cart.items || []).filter(
    (it) =>
      it.prescriptionId !== prescriptionId || (it.pharmacyName || "") !== normPh
  );
  const normalized = (items || []).map((it) => ({
    ...it,
    prescriptionId,
    pharmacyName: normPh,
    quantity: it.quantity || 1,
  }));
  cart.items = [...rest, ...normalized];
  saveCart(cart);
  return cart.items;
}
