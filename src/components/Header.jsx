import React from 'react';
import { TARGET_PRICE_USD, TARGET_PRICE_INR } from '../data/initialBoard';
import { formatPrice } from '../utils/currency';
import { ShieldCheck } from 'lucide-react';
import { playClick } from '../utils/audio';

export function Header({
  totalRaisedUSD = 0,
  currency = 'USD',
  onToggleCurrency,
  biddersCount = 0,
}) {
  const percentage = Math.min(100, Math.round((totalRaisedUSD / TARGET_PRICE_USD) * 100));

  return (
    <header className="mx-auto max-w-5xl px-6 pb-8 pt-10 text-center md:pt-14 select-none">
      {/* Top Navbar / Brand pill */}
      <div className="mx-auto mb-6 flex max-w-sm items-center justify-between rounded-full border border-hairline/70 bg-white/80 px-4 py-1.5 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-ink" viewBox="0 0 28 28" fill="none">
            <rect x="3.5" y="6" width="21" height="16" rx="3.2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M14 7.2v13.6" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span className="text-[13px] font-bold tracking-tight text-ink">tinyspot.lol</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700 border border-orange-200">
            <ShieldCheck className="h-3 w-3 text-orange-600" />
            Dodo Payments
          </span>

          {/* Currency Switcher */}
          <div className="flex items-center rounded-full bg-mist p-0.5 text-[11px] font-medium border border-hairline/50">
            <button
              type="button"
              onClick={() => { playClick(); onToggleCurrency('USD'); }}
              className={`rounded-full px-2.5 py-0.5 transition-all ${
                currency === 'USD'
                  ? 'bg-white font-bold text-ink shadow-xs'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => { playClick(); onToggleCurrency('INR'); }}
              className={`rounded-full px-2.5 py-0.5 transition-all ${
                currency === 'INR'
                  ? 'bg-white font-bold text-ink shadow-xs'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              ₹ INR
            </button>
          </div>
        </div>
      </div>

      {/* Live status badge */}
      <p className="text-[12px] text-ink-2 sm:text-[13px] font-medium">
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle live-indicator"></span>
        Live board · {biddersCount} claimed · {20 - Math.min(20, biddersCount)} spots open
      </p>

      {/* Main Headline */}
      <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,4.2rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-ink">
        Your brand, on my iPhone Fold.
      </h1>

      {/* Description */}
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2 sm:text-[17px]">
        Pay to rank. The <span className="font-semibold text-ink">top 5 sit on the outside screen</span> ($290–$780). Ranks <span className="font-semibold text-ink">6–20 sit on the inside screen</span> ($20–$160).
      </p>

      {/* Goal & Funding Progress Box */}
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-hairline/80 bg-mist/60 p-5 text-left backdrop-blur-sm shadow-xs">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-2xl sm:text-3xl font-bold tabular-nums text-emerald-600">
              {formatPrice(totalRaisedUSD, currency)}
            </span>
            <span className="ml-1.5 text-[13px] text-ink-2 font-medium">raised</span>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-ink-2">
              of <span className="font-semibold text-ink">{formatPrice(TARGET_PRICE_USD, currency)}</span> goal
              <span className="text-hairline"> · </span>
              <span className="font-bold tabular-nums text-emerald-600">{percentage}%</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-hairline/60">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Progress details footer */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-ink-2">
          <span>Target: iPhone Fold India Price (₹2,99,900 ≈ $3,600)</span>
          <span className="font-medium text-ink">
            {totalRaisedUSD >= TARGET_PRICE_USD ? 'Goal reached! 🎉' : `${formatPrice(TARGET_PRICE_USD - totalRaisedUSD, currency)} remaining`}
          </span>
        </div>
      </div>
    </header>
  );
}
