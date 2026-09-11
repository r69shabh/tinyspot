export const TARGET_PRICE_USD = 3600; // $3,600 USD
export const TARGET_PRICE_INR = 299900; // ₹2,99,900 INR (Apple iPhone Fold India launch price)
export const MIN_OUTBID_STEP_USD = 5; // $5 min outbid gap
export const MIN_OUTBID_STEP_INR = 500; // ₹500 min outbid gap

// Exact base prices for vacant spots (sums to $3,600 / ₹2,99,900):
// Outside Cover Screen (Top 5 higher price): $780, $570, $430, $350, $290 = $2,420 (~67%)
// Inside Unfolded Screen (15 spots lower price): $160, $135, $115, $100, $85, $75, $65, $55, $50, $45, $40, $35, $30, $25, $20 = $1,180 (~33%)
export const SPOT_BASE_PRICES = {
  1: 780,
  2: 570,
  3: 430,
  4: 350,
  5: 290,
  6: 160,
  7: 135,
  8: 115,
  9: 100,
  10: 85,
  11: 75,
  12: 65,
  13: 55,
  14: 50,
  15: 45,
  16: 40,
  17: 35,
  18: 30,
  19: 25,
  20: 20,
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
