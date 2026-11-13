import test from "node:test";
import assert from "node:assert/strict";
import { formatMad } from "./format-price";
import {
  cleanPhoneNumber,
  formatMoroccanPhoneDisplay,
  isValidMoroccanPhone,
  normalizeMoroccanPhone,
} from "./phone-validation";
import {
  getAllProducts,
  getCategories,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
} from "./products";

test("catalog returns expected products, categories, and related items", () => {
  const all = getAllProducts();
  assert.equal(all.length, 8);
  assert.equal(getFeaturedProducts().length, 4);
  assert.deepEqual(getCategories(), [
    "Tous",
    "Roses",
    "Pivoines",
    "Saisonnier",
    "Prestige",
    "Romance",
  ]);

  const rose = getProductBySlug("rose-marrakech");
  assert.ok(rose);
  assert.equal(rose.priceMad, 450);

  const related = getRelatedProducts("rose-marrakech", 3);
  assert.equal(related.length, 3);
  assert.equal(
    related.some((p) => p.slug === "rose-marrakech"),
    false,
  );
});

test("formatMad formats Moroccan dirham currency without decimals", () => {
  const formatted = formatMad(620);
  assert.ok(formatted.includes("620"));
  assert.ok(/MAD|DH/i.test(formatted));
});

test("Moroccan phone validation and formatting handle national and international numbers", () => {
  assert.equal(cleanPhoneNumber(" +212 6-12.34 (56) 78 "), "+212612345678");
  assert.equal(isValidMoroccanPhone("+212 6 12 34 56 78"), true);
  assert.equal(isValidMoroccanPhone("0711223344"), true);
  assert.equal(isValidMoroccanPhone("0412345678"), false);
  assert.equal(normalizeMoroccanPhone("+212 6 12 34 56 78"), "0612345678");
  assert.equal(formatMoroccanPhoneDisplay("+212612345678"), "06 12 34 56 78");
});
