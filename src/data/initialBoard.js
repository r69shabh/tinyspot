export const TARGET_PRICE_USD = 3600; // $3,600 USD
export const TARGET_PRICE_INR = 299900; // ₹2,99,900 INR (Apple iPhone Duo India launch price)
export const MIN_OUTBID_STEP_USD = 5; // $5 min outbid gap
export const MIN_OUTBID_STEP_INR = 500; // ₹500 min outbid gap

// Accessible starting base prices:
// Outside Cover Screen (Top 5 spots): $150, $110, $85, $65, $50 ($50–$150)
// Inside Unfolded Screen (15 spots): $35, $30, $25, $22, $20, $18, $16, $15, $14, $12, $12, $10, $10, $10, $10 ($10–$35)
export const SPOT_BASE_PRICES = {
  1: 150,
  2: 110,
  3: 85,
  4: 65,
  5: 50,
  6: 35,
  7: 30,
  8: 25,
  9: 22,
  10: 20,
  11: 18,
  12: 16,
  13: 15,
  14: 14,
  15: 12,
  16: 12,
  17: 10,
  18: 10,
  19: 10,
  20: 10,
};

// Pure scratch initial state: 0 demo brands, all 20 spots vacant
export function createEmptyBoard() {
  return Array.from({ length: 20 }, (_, i) => {
    const rank = i + 1;
    return {
      rank,
      id: `spot-${rank}`,
      screen: rank <= 5 ? 'outside' : (rank <= 13 ? 'inside-left' : 'inside-right'),
      brandName: null,
      url: null,
      tagline: null,
      bidAmount: SPOT_BASE_PRICES[rank] || 20,
      logoBg: null,
      logoText: null,
      claimedAt: null,
    };
  });
}

export const INITIAL_SPONSORS = createEmptyBoard();
export const INITIAL_ACTIVITY = [];
