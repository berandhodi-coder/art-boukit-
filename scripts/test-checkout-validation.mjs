import assert from "node:assert";
import { isValidMoroccanPhone, normalizeMoroccanPhone } from "../src/lib/phone-validation.ts";
import { getProductBySlug } from "../src/lib/products.ts";
import { submitOrder } from "../src/app/actions/checkout.ts";

console.log("=== RUNNING MILESTONE 3B VALIDATION TESTS ===");

// TEST 1: Moroccan Phone Number Validation
console.log("\n[Test 1] Testing Moroccan Phone Validation...");
const validPhones = [
  "0612345678",
  "0711223344",
  "0522112233",
  "+212612345678",
  "+212 6 12 34 56 78",
  "+212711223344",
  "00212612345678",
  "06-12-34-56-78",
  "06.12.34.56.78",
];

for (const phone of validPhones) {
  assert.strictEqual(
    isValidMoroccanPhone(phone),
    true,
    `Expected valid phone for: ${phone}`
  );
  const normalized = normalizeMoroccanPhone(phone);
  assert.strictEqual(normalized.length, 10, `Expected 10 digits for: ${normalized}`);
  assert.strictEqual(normalized.startsWith("0"), true);
}

const invalidPhones = [
  "",
  "   ",
  "123456",
  "0412345678", // 04 prefix does not exist in Morocco
  "+33612345678", // French number
  "061234567", // Only 9 digits
  "061234567890", // 12 digits
  "abcdefghij",
];

for (const phone of invalidPhones) {
  assert.strictEqual(
    isValidMoroccanPhone(phone),
    false,
    `Expected invalid phone for: ${phone}`
  );
}
console.log("✓ Moroccan phone number validation passed (all cases verified).");

// TEST 2: Authoritative Product Catalog Lookup & Server-Side Price Verification
console.log("\n[Test 2] Testing Server-side Catalog Pricing...");
const testP1 = getProductBySlug("rose-marrakech");
const testP2 = getProductBySlug("pivoine-ivoire");
assert.ok(testP1, "Rose de Marrakech must exist");
assert.ok(testP2, "Pivoine Ivoire must exist");
assert.strictEqual(testP1.priceMad, 450);
assert.strictEqual(testP2.priceMad, 620);
console.log("✓ Authoritative catalog prices verified.");

// TEST 3: Order Submission with Missing Supabase Config (Graceful Failure & No Fake Success)
console.log("\n[Test 3] Testing Missing Supabase Configuration Handling...");
const resultNoConfig = await submitOrder({
  customerName: "Kawtar Alami",
  customerPhone: "0661223344",
  city: "Casablanca",
  deliveryAddress: "12 Rue des Fleurs, Gauthier",
  termsAccepted: true,
  items: [
    { productId: "rose-marrakech", quantity: 2 },
    { productId: "pivoine-ivoire", quantity: 1 },
  ],
});

// Since live credentials are not set in the test environment, the server MUST NOT claim success
assert.strictEqual(resultNoConfig.success, false);
assert.strictEqual(resultNoConfig.missingConfig, true);
assert.ok(resultNoConfig.error.includes("Supabase"));
console.log("✓ Server action correctly refuses to claim success when database is not configured.");

// TEST 4: Rejection of Unknown Product ID
console.log("\n[Test 4] Testing Unknown Product ID Rejection...");
const resultUnknownProduct = await submitOrder({
  customerName: "Kawtar Alami",
  customerPhone: "0661223344",
  city: "Casablanca",
  deliveryAddress: "12 Rue des Fleurs, Gauthier",
  termsAccepted: true,
  items: [{ productId: "unknown-fake-product-123", quantity: 1 }],
});

assert.strictEqual(resultUnknownProduct.success, false);
assert.ok(resultUnknownProduct.error.includes("n'existe plus"));
console.log("✓ Unknown product correctly rejected.");

// TEST 5: Rejection of Invalid Quantities
console.log("\n[Test 5] Testing Invalid Quantity Rejection...");
const resultZeroQty = await submitOrder({
  customerName: "Kawtar Alami",
  customerPhone: "0661223344",
  city: "Casablanca",
  deliveryAddress: "12 Rue des Fleurs, Gauthier",
  termsAccepted: true,
  items: [{ productId: "rose-marrakech", quantity: 0 }],
});
assert.strictEqual(resultZeroQty.success, false);
assert.ok(resultZeroQty.error.includes("quantité"));

const resultTooHighQty = await submitOrder({
  customerName: "Kawtar Alami",
  customerPhone: "0661223344",
  city: "Casablanca",
  deliveryAddress: "12 Rue des Fleurs, Gauthier",
  termsAccepted: true,
  items: [{ productId: "rose-marrakech", quantity: 15 }],
});
assert.strictEqual(resultTooHighQty.success, false);
console.log("✓ Invalid quantities (0 and >10) correctly rejected.");

// TEST 6: Missing Required Fields & Phone Error Rejection
console.log("\n[Test 6] Testing Required Fields & Phone Error Rejection...");
const resultInvalidPhone = await submitOrder({
  customerName: "K",
  customerPhone: "0499887766", // Invalid phone
  city: "",
  deliveryAddress: "abc",
  termsAccepted: false,
  items: [{ productId: "rose-marrakech", quantity: 1 }],
});
assert.strictEqual(resultInvalidPhone.success, false);
assert.ok(resultInvalidPhone.fieldErrors);
assert.ok(resultInvalidPhone.fieldErrors.customerName);
assert.ok(resultInvalidPhone.fieldErrors.customerPhone);
assert.ok(resultInvalidPhone.fieldErrors.city);
assert.ok(resultInvalidPhone.fieldErrors.deliveryAddress);
assert.ok(resultInvalidPhone.fieldErrors.termsAccepted);
console.log("✓ All field validations and Moroccan phone format checks passed.");

// TEST 7: Empty Cart Rejection
console.log("\n[Test 7] Testing Empty Cart Rejection...");
const resultEmptyCart = await submitOrder({
  customerName: "Kawtar Alami",
  customerPhone: "0661223344",
  city: "Casablanca",
  deliveryAddress: "12 Rue des Fleurs, Gauthier",
  termsAccepted: true,
  items: [],
});
assert.strictEqual(resultEmptyCart.success, false);
assert.ok(resultEmptyCart.error.includes("panier est vide"));
console.log("✓ Empty cart correctly rejected.");

console.log("\n=================================================");
console.log("ALL 7 SERVER VALIDATION TEST SUITES PASSED (0 ERRORS)!");
console.log("=================================================");
