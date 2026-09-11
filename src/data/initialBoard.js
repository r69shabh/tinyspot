export const TARGET_PRICE_USD = 3600; // $3,600 USD
export const TARGET_PRICE_INR = 299900; // ₹2,99,900 INR (Apple iPhone Fold India launch price)
export const MIN_OUTBID_STEP_USD = 5; // $5 min outbid gap
export const MIN_OUTBID_STEP_INR = 500; // ₹500 min outbid gap

// Exact base prices for vacant spots (sums to $3,600 / ₹2,99,900):
// Outside Cover Screen (Top 5 higher price): $780, $570, $430, $350, $290 = $2,420 (~67%)
// Inside Unfolded Screen (15 spots lower price): $180, $155, $135, $115, $100, $85, $75, $65, $55, $50, $45, $40, $35, $30, $20 = $1,180 (~33%)
export const SPOT_BASE_PRICES = {
  1: 780,
  2: 570,
  3: 430,
  4: 350,
  5: 290,
  6: 180,
  7: 155,
  8: 135,
  9: 115,
  10: 100,
  11: 85,
  12: 75,
  13: 65,
  14: 55,
  15: 50,
  16: 45,
  17: 40,
  18: 35,
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
