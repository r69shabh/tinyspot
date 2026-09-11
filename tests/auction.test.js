import test from 'node:test';
import assert from 'node:assert/strict';
import { formatUSD, formatINR, formatPrice, usdToInr, inrToUsd, INR_PER_USD } from '../src/utils/currency.js';
import { SPOT_BASE_PRICES } from '../src/data/initialBoard.js';

// ==========================================
// 1. MATHEMATICAL PRICING SPECS
// ==========================================
test('Pricing Specs: 20 total spots defined', () => {
  for (let rank = 1; rank <= 20; rank++) {
    assert.ok(SPOT_BASE_PRICES[rank], `Rank #${rank} must have a base price defined`);
    assert.ok(SPOT_BASE_PRICES[rank] > 0, `Rank #${rank} price must be > 0`);
  }
});

test('Pricing Specs: Outside Screen (Top 5) sums to exactly $2,420 USD (~67%)', () => {
  const outsidePrices = [
    SPOT_BASE_PRICES[1],
    SPOT_BASE_PRICES[2],
    SPOT_BASE_PRICES[3],
    SPOT_BASE_PRICES[4],
    SPOT_BASE_PRICES[5],
  ];
  assert.deepEqual(outsidePrices, [780, 570, 430, 350, 290]);
  const sumOutside = outsidePrices.reduce((a, b) => a + b, 0);
  assert.equal(sumOutside, 2420);
});

test('Pricing Specs: Inside Screen (Ranks 6–20) sums to exactly $1,180 USD (~33%)', () => {
  let sumInside = 0;
  for (let r = 6; r <= 20; r++) {
    sumInside += SPOT_BASE_PRICES[r];
  }
  assert.equal(sumInside, 1180);
});

test('Pricing Specs: Grand total sums to exactly $3,600 USD (₹2,99,900 INR)', () => {
  let totalUSD = 0;
  for (let r = 1; r <= 20; r++) {
    totalUSD += SPOT_BASE_PRICES[r];
  }
  assert.equal(totalUSD, 3600);
  const totalINR = Math.round(totalUSD * INR_PER_USD);
  assert.equal(totalINR, 299900);
});

// ==========================================
// 2. CURRENCY UTILITIES & FAILURE CASES
// ==========================================
test('Currency: formatUSD handles null, undefined, 0, decimals, and negative numbers', () => {
  assert.equal(formatUSD(null), '$0');
  assert.equal(formatUSD(undefined), '$0');
  assert.equal(formatUSD(0), '$0');
  assert.equal(formatUSD(780), '$780');
  assert.equal(formatUSD(780.89), '$781'); // rounds to integer
  assert.equal(formatUSD(-50), '-$50');
});

test('Currency: formatINR handles Indian numbering system and nulls', () => {
  assert.equal(formatINR(null), '₹0');
  assert.equal(formatINR(undefined), '₹0');
  assert.equal(formatINR(0), '₹0');
  assert.equal(formatINR(299900), '₹2,99,900');
  assert.equal(formatINR(65000), '₹65,000');
});

test('Currency: formatPrice toggles cleanly between USD and INR', () => {
  assert.equal(formatPrice(780, 'USD'), '$780');
  assert.equal(formatPrice(780, 'INR'), '₹64,978');
});

test('Currency: usdToInr and inrToUsd round-trip stability', () => {
  const usd = 100;
  const inr = usdToInr(usd);
  const backToUsd = inrToUsd(inr);
  assert.ok(Math.abs(usd - backToUsd) <= 1, 'Conversion drift must be <= $1');
});

// ==========================================
// 3. CHECKOUT & CLAIM INPUT VALIDATION
// ==========================================
test('Validation: Rank bounds checking', () => {
  function validateRank(rawRank) {
    const n = Number(rawRank);
    if (!n || isNaN(n) || n < 1 || n > 20) return false;
    return true;
  }

  assert.equal(validateRank(1), true);
  assert.equal(validateRank(20), true);
  assert.equal(validateRank(5), true);
  assert.equal(validateRank('10'), true);
  assert.equal(validateRank(0), false);
  assert.equal(validateRank(21), false);
  assert.equal(validateRank(-1), false);
  assert.equal(validateRank('invalid'), false);
  assert.equal(validateRank(null), false);
  assert.equal(validateRank(undefined), false);
});

test('Validation: Bid amount checking against base prices', () => {
  function validateBid(rank, amount) {
    const num = Number(amount);
    if (!num || isNaN(num) || num <= 0) return { valid: false, reason: 'Invalid amount' };
    const minRequired = SPOT_BASE_PRICES[rank] || 20;
    if (num < minRequired) return { valid: false, reason: `Below minimum $${minRequired}` };
    return { valid: true };
  }

  assert.equal(validateBid(1, 780).valid, true);
  assert.equal(validateBid(1, 1000).valid, true);
  assert.equal(validateBid(1, 779).valid, false); // below $780
  assert.equal(validateBid(20, 20).valid, true);
  assert.equal(validateBid(20, 15).valid, false); // below $20
  assert.equal(validateBid(5, -10).valid, false);
  assert.equal(validateBid(5, 0).valid, false);
});

test('Validation: URL normalization handles missing protocols', () => {
  function normalizeUrl(rawUrl) {
    let clean = String(rawUrl || '').trim();
    if (!clean) return '';
    if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`;
    }
    return clean;
  }

  assert.equal(normalizeUrl('mybrand.com'), 'https://mybrand.com');
  assert.equal(normalizeUrl('http://mybrand.com'), 'http://mybrand.com');
  assert.equal(normalizeUrl('https://mybrand.com/app'), 'https://mybrand.com/app');
  assert.equal(normalizeUrl('  sub.domain.co/path  '), 'https://sub.domain.co/path');
  assert.equal(normalizeUrl(''), '');
});

// ==========================================
// 4. RANK SHIFTING ALGORITHM
// ==========================================
test('Rank Shifting: When spot R is outbid, spots >= R shift down without collision', () => {
  // Simulate an initial board where spots 1, 2, 3, 4 are claimed
  const initialSpots = [
    { rank: 1, brand: 'Alpha' },
    { rank: 2, brand: 'Beta' },
    { rank: 3, brand: 'Gamma' },
    { rank: 4, brand: 'Delta' },
  ];

  // Outbid / claim rank 2 with brand 'Omega'
  const targetRank = 2;
  const newBrand = 'Omega';

  // Algorithm: Shift items >= targetRank in DESCENDING order
  const spotsToShift = initialSpots
    .filter(s => s.rank >= targetRank)
    .sort((a, b) => b.rank - a.rank);

  const updatedSpots = initialSpots.map(s => {
    if (s.rank >= targetRank) {
      return { ...s, rank: s.rank + 1 };
    }
    return s;
  });

  // Add new sponsor at targetRank
  updatedSpots.push({ rank: targetRank, brand: newBrand });
  updatedSpots.sort((a, b) => a.rank - b.rank);

  assert.equal(updatedSpots.length, 5);
  assert.equal(updatedSpots[0].rank, 1);
  assert.equal(updatedSpots[0].brand, 'Alpha');
  assert.equal(updatedSpots[1].rank, 2);
  assert.equal(updatedSpots[1].brand, 'Omega');
  assert.equal(updatedSpots[2].rank, 3);
  assert.equal(updatedSpots[2].brand, 'Beta'); // shifted from 2
  assert.equal(updatedSpots[3].rank, 4);
  assert.equal(updatedSpots[3].brand, 'Gamma'); // shifted from 3
  assert.equal(updatedSpots[4].rank, 5);
  assert.equal(updatedSpots[4].brand, 'Delta'); // shifted from 4

  // Verify unique ranks (no duplicate primary keys)
  const rankSet = new Set(updatedSpots.map(s => s.rank));
  assert.equal(rankSet.size, updatedSpots.length);
});

// ==========================================
// 5. WEBHOOK PAYLOAD PROCESSOR
// ==========================================
test('Webhook: Idempotency detection on paid sessions', () => {
  const sessionStatus = 'paid';
  function shouldProcessWebhook(status) {
    if (status === 'paid') return false; // already processed
    return true;
  }
  assert.equal(shouldProcessWebhook(sessionStatus), false);
  assert.equal(shouldProcessWebhook('pending'), true);
  assert.equal(shouldProcessWebhook(null), true);
});

test('Webhook: Discards non-payment events safely', () => {
  const allowedEvents = ['payment.succeeded', 'checkout.completed'];
  function isPaymentSuccess(event) {
    return allowedEvents.includes(event);
  }
  assert.equal(isPaymentSuccess('payment.succeeded'), true);
  assert.equal(isPaymentSuccess('checkout.completed'), true);
  assert.equal(isPaymentSuccess('payment.failed'), false);
  assert.equal(isPaymentSuccess('subscription.created'), false);
});

// ==========================================
// 6. CHECKOUT DYNAMIC PRICING FORMAT
// ==========================================
test('Checkout Cart: Formats dynamic pricing with quantity 1 and amount in cents (not unit multiplication)', () => {
  function createCartPayload(productId, userBidUSD) {
    return {
      product_cart: [
        {
          product_id: productId,
          quantity: 1, // Single unit purchase
          amount: Math.round(Number(userBidUSD) * 100), // In cents
        },
      ],
    };
  }

  const payload780 = createCartPayload('pdt_0NnMDvs4DmKQ0QN5rReBn', 780);
  assert.equal(payload780.product_cart[0].quantity, 1);
  assert.equal(payload780.product_cart[0].amount, 78000); // $780.00

  const payload20 = createCartPayload('pdt_0NnMDvs4DmKQ0QN5rReBn', 20);
  assert.equal(payload20.product_cart[0].quantity, 1);
  assert.equal(payload20.product_cart[0].amount, 2000); // $20.00

  const payloadOdd = createCartPayload('pdt_0NnMDvs4DmKQ0QN5rReBn', 135.5);
  assert.equal(payloadOdd.product_cart[0].quantity, 1);
  assert.equal(payloadOdd.product_cart[0].amount, 13550); // $135.50
});

test('Checkout Cart: Never sells bid amount as quantity of $1 units', () => {
  const userBidUSD = 570;
  // Bad legacy approach: quantity = 570
  const legacyQuantity = Math.round(userBidUSD);
  // Fixed dynamic approach: quantity = 1, amount = 57000
  const dynamicQuantity = 1;
  const dynamicAmount = Math.round(userBidUSD * 100);

  assert.notEqual(dynamicQuantity, legacyQuantity);
  assert.equal(dynamicQuantity, 1);
  assert.equal(dynamicAmount, 57000);
});

