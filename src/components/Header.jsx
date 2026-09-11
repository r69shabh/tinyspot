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
      <div className="mx-auto mb-6 flex max-w-md items-center justify-between rounded-full border border-hairline/70 bg-white/80 px-4 py-1.5 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-ink" viewBox="0 0 28 28" fill="none">
            <rect x="3.5" y="6" width="21" height="16" rx="3.2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M14 7.2v13.6" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span className="text-[13px] font-bold tracking-tight text-ink">tinyspot.lol</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Creator Links */}
          <div className="flex items-center gap-1 text-ink-2">
            <a
              href="https://x.com/r69shabh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:text-ink transition-colors"
              title="Rishabh on X (@r69shabh)"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/r69shabh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:text-ink transition-colors"
              title="Rishabh on GitHub (@r69shabh)"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>

          <div className="h-3 w-px bg-hairline/80 mx-0.5" />

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

      {/* Eyebrow badge */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-semibold text-orange-950 shadow-2xs">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          <span>India's 1st iPhone Duo Crowdfund</span>
          <span className="text-orange-400">·</span>
          <span className="font-bold text-orange-900">$3,600 Target</span>
        </p>
        <a
          href="https://x.com/r69shabh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-hairline bg-white/80 hover:bg-white px-2.5 py-1 text-xs font-semibold text-ink-2 hover:text-ink transition-colors shadow-2xs"
          title="Follow Rishabh on X"
        >
          <span>by @r69shabh</span>
        </a>
      </div>

      {/* Main Headline */}
      <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,4.2rem)] font-bold leading-[1.04] tracking-[-0.04em] text-ink">
        Put your brand on Apple's first iPhone Duo.
      </h1>

      {/* Description */}
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2 sm:text-[17px]">
        An outbid auction for 20 permanent spots on the first folding iPhone Duo in India. The <span className="font-semibold text-ink">top 5 command the outside cover screen</span> ($50–$150). Ranks <span className="font-semibold text-ink">6–20 take the dual folding screen inside</span> ($10–$35).
      </p>

      {/* Real-world Visibility Badges */}
      <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-ink-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-hairline/80 bg-white/90 px-3 py-1 shadow-2xs">
          🎓 <strong className="text-ink font-semibold">2,500+ Student Tech Campus</strong>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-hairline/80 bg-white/90 px-3 py-1 shadow-2xs">
          🏢 <strong className="text-ink font-semibold">Gurgaon Cyber City & Golf Course Rd</strong>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-hairline/80 bg-white/90 px-3 py-1 shadow-2xs">
          🍸 <strong className="text-ink font-semibold">Delhi Tech Circles & Elite Founders</strong>
        </span>
      </div>

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
          <span>Target: iPhone Duo India Price (₹2,99,900 ≈ $3,600)</span>
          <span className="font-medium text-ink">
            {totalRaisedUSD >= TARGET_PRICE_USD ? 'Goal reached! 🎉' : `${formatPrice(TARGET_PRICE_USD - totalRaisedUSD, currency)} remaining`}
          </span>
        </div>
      </div>
    </header>
  );
}
