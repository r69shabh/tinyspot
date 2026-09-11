export const TARGET_PRICE_USD = 3600; // $3,600 USD
export const TARGET_PRICE_INR = 299900; // ₹2,99,900 INR (iPhone Fold India launch price)
export const MIN_OUTBID_STEP_USD = 5; // $5 min outbid gap
export const MIN_OUTBID_STEP_INR = 500; // ₹500 min outbid gap

// Exact mathematical breakdown:
// Outside Screen (Top 5 higher price): $780 + $570 + $430 + $350 + $290 = $2,420 (~67% of goal)
// Inside Screen (15 spots lower price): 160+135+115+100+85+75+65+55+50+45+40+35+30+25+20 = $1,180 (~33% of goal)
// Total 20 spots = $3,600 USD / ₹2,99,900 INR

export const INITIAL_SPONSORS = [
  // OUTSIDE SCREEN: TOP 5 PREMIER SPOTS (HIGHER PRICE TIER)
  {
    rank: 1,
    id: 'spot-1',
    screen: 'outside',
    brandName: 'Zepto',
    url: 'https://www.zeptonow.com',
    tagline: '10-minute grocery delivery across India',
    bidAmount: 780, // $780 (~₹65,000)
    logoBg: '#7c1cff',
    logoText: '⚡',
    claimedAt: Date.now() - 1000 * 60 * 35,
  },
  {
    rank: 2,
    id: 'spot-2',
    screen: 'outside',
    brandName: 'Linear',
    url: 'https://linear.app',
    tagline: 'The issue tracking tool you will enjoy using',
    bidAmount: 570, // $570 (~₹47,500)
    logoBg: '#5e6ad2',
    logoText: '◆',
    claimedAt: Date.now() - 1000 * 60 * 90,
  },
  {
    rank: 3,
    id: 'spot-3',
    screen: 'outside',
    brandName: 'Razorpay',
    url: 'https://razorpay.com',
    tagline: 'Payments and banking infrastructure for India',
    bidAmount: 430, // $430 (~₹35,800)
    logoBg: '#0c2340',
    logoText: '₹',
    claimedAt: Date.now() - 1000 * 60 * 150,
  },
  {
    rank: 4,
    id: 'spot-4',
    screen: 'outside',
    brandName: 'Cursor',
    url: 'https://cursor.com',
    tagline: 'The AI-first code editor built for engineers',
    bidAmount: 350, // $350 (~₹29,200)
    logoBg: '#18181b',
    logoText: '⚡︎',
    claimedAt: Date.now() - 1000 * 60 * 220,
  },
  {
    rank: 5,
    id: 'spot-5',
    screen: 'outside',
    brandName: 'Supabase',
    url: 'https://supabase.com',
    tagline: 'The open source Firebase alternative',
    bidAmount: 290, // $290 (~₹24,160)
    logoBg: '#3ecf8e',
    logoText: '⚡',
    claimedAt: Date.now() - 1000 * 60 * 300,
  },

  // INSIDE SCREEN: 15 APP SPOTS (LOWER PRICE TIER, RANKS 6 THROUGH 20)
  {
    rank: 6,
    id: 'spot-6',
    screen: 'inside-left',
    brandName: 'Zerodha',
    url: 'https://zerodha.com',
    tagline: 'Zero brokerage investments for Indian markets',
    bidAmount: 160, // $160 (~₹13,300)
    logoBg: '#387ed1',
    logoText: 'Z',
    claimedAt: Date.now() - 1000 * 60 * 360,
  },
  {
    rank: 7,
    id: 'spot-7',
    screen: 'inside-left',
    brandName: 'Postman',
    url: 'https://www.postman.com',
    tagline: 'Leading collaborative platform for building APIs',
    bidAmount: 135, // $135 (~₹11,200)
    logoBg: '#ff6c37',
    logoText: '🚀',
    claimedAt: Date.now() - 1000 * 60 * 420,
  },
  {
    rank: 8,
    id: 'spot-8',
    screen: 'inside-left',
    brandName: 'Vercel',
    url: 'https://vercel.com',
    tagline: 'Develop. Preview. Ship.',
    bidAmount: 115, // $115 (~₹9,600)
    logoBg: '#000000',
    logoText: '▲',
    claimedAt: Date.now() - 1000 * 60 * 480,
  },
  {
    rank: 9,
    id: 'spot-9',
    screen: 'inside-left',
    brandName: 'Raycast',
    url: 'https://raycast.com',
    tagline: 'Supercharged productivity launcher for Mac',
    bidAmount: 100, // $100 (~₹8,300)
    logoBg: '#ff6363',
    logoText: '✦',
    claimedAt: Date.now() - 1000 * 60 * 540,
  },
  {
    rank: 10,
    id: 'spot-10',
    screen: 'inside-left',
    brandName: 'Notion',
    url: 'https://notion.so',
    tagline: 'Connected workspace for wiki, docs & projects',
    bidAmount: 85, // $85 (~₹7,100)
    logoBg: '#ffffff',
    logoColor: '#000000',
    logoText: 'N',
    claimedAt: Date.now() - 1000 * 60 * 600,
  },
  {
    rank: 11,
    id: 'spot-11',
    screen: 'inside-left',
    brandName: 'Figma',
    url: 'https://figma.com',
    tagline: 'How collaborative teams design together',
    bidAmount: 75, // $75 (~₹6,250)
    logoBg: '#a259ff',
    logoText: '❖',
    claimedAt: Date.now() - 1000 * 60 * 660,
  },
  {
    rank: 12,
    id: 'spot-12',
    screen: 'inside-left',
    brandName: 'GitHub',
    url: 'https://github.com',
    tagline: 'Where the world builds software',
    bidAmount: 65, // $65 (~₹5,400)
    logoBg: '#24292e',
    logoText: '🐙',
    claimedAt: Date.now() - 1000 * 60 * 720,
  },
  {
    rank: 13,
    id: 'spot-13',
    screen: 'inside-left',
    brandName: 'Midjourney',
    url: 'https://midjourney.com',
    tagline: 'Generative AI imagery and creative tooling',
    bidAmount: 55, // $55 (~₹4,600)
    logoBg: '#0f172a',
    logoText: '⛵',
    claimedAt: Date.now() - 1000 * 60 * 780,
  },
  {
    rank: 14,
    id: 'spot-14',
    screen: 'inside-right',
    brandName: 'Resend',
    url: 'https://resend.com',
    tagline: 'Modern email API for developers',
    bidAmount: 50, // $50 (~₹4,200)
    logoBg: '#000000',
    logoText: '✉',
    claimedAt: Date.now() - 1000 * 60 * 840,
  },
  {
    rank: 15,
    id: 'spot-15',
    screen: 'inside-right',
    brandName: 'Perplexity',
    url: 'https://perplexity.ai',
    tagline: 'Where knowledge begins. AI search engine',
    bidAmount: 45, // $45 (~₹3,750)
    logoBg: '#1a1f2c',
    logoText: '✳',
    claimedAt: Date.now() - 1000 * 60 * 900,
  },
  {
    rank: 16,
    id: 'spot-16',
    screen: 'inside-right',
    brandName: 'Dodo Payments',
    url: 'https://dodopayments.com',
    tagline: 'Merchant of Record for AI and global SaaS',
    bidAmount: 40, // $40 (~₹3,350)
    logoBg: '#f97316',
    logoText: '🦤',
    claimedAt: Date.now() - 1000 * 60 * 960,
  },
  {
    rank: 17,
    id: 'spot-17',
    screen: 'inside-right',
    brandName: 'ElevenLabs',
    url: 'https://elevenlabs.io',
    tagline: 'Generative AI voice and speech synthesis',
    bidAmount: 35, // $35 (~₹2,900)
    logoBg: '#000000',
    logoText: '11',
    claimedAt: Date.now() - 1000 * 60 * 1020,
  },
  {
    rank: 18,
    id: 'spot-18',
    screen: 'inside-right',
    brandName: 'Loom',
    url: 'https://loom.com',
    tagline: 'Async video messaging for modern teams',
    bidAmount: 30, // $30 (~₹2,500)
    logoBg: '#625df5',
    logoText: '✦',
    claimedAt: Date.now() - 1000 * 60 * 1080,
  },
  {
    rank: 19,
    id: 'spot-19',
    screen: 'inside-right',
    brandName: 'Cal.com',
    url: 'https://cal.com',
    tagline: 'Open source scheduling infrastructure',
    bidAmount: 25, // $25 (~₹2,100)
    logoBg: '#292929',
    logoText: '📅',
    claimedAt: Date.now() - 1000 * 60 * 1140,
  },
  {
    rank: 20,
    id: 'spot-20',
    screen: 'inside-right',
    brandName: 'Excalidraw',
    url: 'https://excalidraw.com',
    tagline: 'Virtual collaborative whiteboard tool',
    bidAmount: 20, // $20 (~₹1,690)
    logoBg: '#6965db',
    logoText: '✎',
    claimedAt: Date.now() - 1000 * 60 * 1200,
  },

  // WAITLIST / EXTENDED BOARD (RANKS 21+)
  {
    rank: 21,
    id: 'spot-21',
    screen: 'waitlist',
    brandName: 'Hono',
    url: 'https://hono.dev',
    tagline: 'Ultrafast, lightweight web framework',
    bidAmount: 15,
    logoBg: '#e36002',
    logoText: '🔥',
    claimedAt: Date.now() - 1000 * 60 * 1300,
  },
  {
    rank: 22,
    id: 'spot-22',
    screen: 'waitlist',
    brandName: 'Biome',
    url: 'https://biomejs.dev',
    tagline: 'Modern toolchain for formatting and linting',
    bidAmount: 10,
    logoBg: '#60a5fa',
    logoText: '⚡',
    claimedAt: Date.now() - 1000 * 60 * 1400,
  }
];

export const INITIAL_ACTIVITY = [
  {
    id: 'act-1',
    type: 'outbid',
    brandName: 'Zepto',
    previousBrandName: 'Linear',
    rank: 1,
    amount: 780,
    timestamp: Date.now() - 1000 * 60 * 35,
  },
  {
    id: 'act-2',
    type: 'claim',
    brandName: 'Cursor',
    rank: 4,
    amount: 350,
    timestamp: Date.now() - 1000 * 60 * 220,
  },
  {
    id: 'act-3',
    type: 'claim',
    brandName: 'Dodo Payments',
    rank: 16,
    amount: 40,
    timestamp: Date.now() - 1000 * 60 * 960,
  }
];
