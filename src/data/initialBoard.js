export const TARGET_PRICE_USD = 3600; // $3,600 USD
export const TARGET_PRICE_INR = 299900; // ₹2,99,900 INR (Apple iPhone Duo India launch price)
export const MIN_OUTBID_STEP_USD = 1; // $1 min outbid gap
export const MIN_OUTBID_STEP_INR = 80; // ₹80 min outbid gap

// Accessible starting base prices:
// Outside Cover Screen (Top 5 spots): $5 USD minimum
// Inside Unfolded Screen (Ranks 6–20): $1 USD minimum
export const SPOT_BASE_PRICES = {
  1: 5,
  2: 5,
  3: 5,
  4: 5,
  5: 5,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
  11: 1,
  12: 1,
  13: 1,
  14: 1,
  15: 1,
  16: 1,
  17: 1,
  18: 1,
  19: 1,
  20: 1,
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
      bidAmount: SPOT_BASE_PRICES[rank] || (rank <= 5 ? 5 : 1),
      logoBg: null,
      logoText: null,
      claimedAt: null,
    };
  });
}

export const INITIAL_SPONSORS = createEmptyBoard();
export const INITIAL_ACTIVITY = [];
