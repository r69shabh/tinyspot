import React from 'react';
import { ExternalLink, Plus } from 'lucide-react';
import { formatPrice } from '../utils/currency';

export function SpotElement({
  spot,
  mode = 'live',
  currency = 'USD',
  onClaim,
  variant = 'icon', // 'hero' | 'medium' | 'tile' | 'icon'
}) {
  const isVacant = !spot.brandName;
  const outbidStep = currency === 'USD' ? 5 : 500;

  // Final look: Clean pristine Apple look without overlays
  if (mode === 'final') {
    if (isVacant) return null;

    if (variant === 'hero') {
      return (
        <a
          href={spot.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white shadow-md"
                style={{ backgroundColor: spot.logoBg || '#1d1d1f', color: spot.logoColor || '#ffffff' }}
              >
                {spot.logoText || spot.brandName.slice(0, 2)}
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight text-[15px] leading-snug">{spot.brandName}</h4>
                <span className="text-[11px] text-white/60 font-medium">Rank #1 Sponsor</span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
          </div>
          <p className="mt-2 text-[12px] leading-normal text-white/80 line-clamp-2">{spot.tagline}</p>
        </a>
      );
    }

    if (variant === 'medium') {
      return (
        <a
          href={spot.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-3 transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: spot.logoBg || '#1d1d1f', color: spot.logoColor || '#ffffff' }}
            >
              {spot.logoText || spot.brandName.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="truncate text-[13px] font-semibold text-white">{spot.brandName}</h5>
              <span className="text-[10px] text-white/50">#{spot.rank}</span>
            </div>
          </div>
          <p className="text-[11px] text-white/70 truncate">{spot.tagline}</p>
        </a>
      );
    }

    // Default icon style (inside screen & tile)
    return (
      <a
        href={spot.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center justify-center text-center transition-transform duration-200 hover:scale-105"
      >
        <div
          className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-[22%] text-base sm:text-lg font-bold shadow-lg transition-shadow group-hover:shadow-xl"
          style={{
            backgroundColor: spot.logoBg || '#222226',
            color: spot.logoColor || '#ffffff',
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          {spot.logoText || spot.brandName.slice(0, 2)}
        </div>
        <span className="mt-1 w-full truncate text-[10px] font-medium text-white/90 drop-shadow-sm">
          {spot.brandName}
        </span>
      </a>
    );
  }

  // Live Mode: Shows rank badges, price pills, and hover outbid prompts
  if (isVacant) {
    return (
      <button
        onClick={() => onClaim?.(spot)}
        className="spot-container group relative flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/5 p-2 transition-all duration-200 hover:border-white/50 hover:bg-white/15"
      >
        <Plus className="h-5 w-5 text-white/50 group-hover:text-white" />
        <span className="mt-1 text-[10px] font-medium text-white/60">Spot #{spot.rank}</span>
        <div className="claim-pill">Claim #{spot.rank}</div>
      </button>
    );
  }

  // Live Hero Widget (#1)
  if (variant === 'hero') {
    return (
      <div className="spot-container group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-3 sm:p-4 backdrop-blur-xl transition-all duration-200 hover:border-white/40 hover:bg-black/60 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl text-base sm:text-lg font-bold text-white shadow-md"
              style={{ backgroundColor: spot.logoBg || '#1d1d1f', color: spot.logoColor || '#ffffff' }}
            >
              {spot.logoText || spot.brandName.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/30">
                  #1 LEADER
                </span>
                <span className="text-[11px] font-semibold text-white/90 truncate">
                  {formatPrice(spot.bidAmount, currency)}
                </span>
              </div>
              <h4 className="truncate text-[14px] sm:text-[15px] font-bold text-white">{spot.brandName}</h4>
            </div>
          </div>
          <a
            href={spot.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full bg-white/10 p-1.5 text-white/70 hover:bg-white/20 hover:text-white"
            title="Visit site"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="mt-2 text-[11px] sm:text-[12px] text-white/75 line-clamp-2">{spot.tagline}</p>
        <button
          onClick={() => onClaim?.(spot)}
          className="claim-pill"
        >
          Outbid #{spot.rank} · {formatPrice(spot.bidAmount + 5, currency)}
        </button>
      </div>
    );
  }

  // Live Medium Widget (#2 & #3)
  if (variant === 'medium') {
    return (
      <div className="spot-container group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-black/40 p-2 sm:p-2.5 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-black/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg text-xs sm:text-sm font-bold shadow-sm"
              style={{ backgroundColor: spot.logoBg || '#1d1d1f', color: spot.logoColor || '#ffffff' }}
            >
              {spot.logoText || spot.brandName.slice(0, 2)}
            </div>
            <div className="min-w-0 truncate">
              <span className="text-[9px] font-bold text-white/50">#{spot.rank}</span>
              <h5 className="truncate text-[12px] font-semibold text-white leading-tight">{spot.brandName}</h5>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400">
            {formatPrice(spot.bidAmount, currency)}
          </span>
        </div>
        <p className="mt-1 text-[10px] text-white/70 truncate">{spot.tagline}</p>
        <button
          onClick={() => onClaim?.(spot)}
          className="claim-pill"
        >
          Outbid #{spot.rank}
        </button>
      </div>
    );
  }

  // Live App Icon style (#4 & #5 tile on outside, #6-#20 on inside screen)
  return (
    <div className="spot-container group relative flex flex-col items-center justify-center text-center p-1">
      <div className="relative">
        <div
          className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-[22%] text-xs sm:text-sm font-bold shadow-md transition-all duration-200 group-hover:scale-105 group-hover:ring-2 group-hover:ring-white/80"
          style={{
            backgroundColor: spot.logoBg || '#222226',
            color: spot.logoColor || '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {spot.logoText || spot.brandName.slice(0, 2)}
        </div>
        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-ink/90 px-1 py-0.2 text-[8px] font-bold text-white/90 border border-white/20">
          #{spot.rank}
        </span>
      </div>
      <span className="mt-1 w-full truncate text-[10px] font-medium text-white/90 drop-shadow-sm">
        {spot.brandName}
      </span>
      <span className="text-[8px] sm:text-[9px] text-emerald-300 font-semibold leading-none">
        {formatPrice(spot.bidAmount, currency)}
      </span>
      <button
        onClick={() => onClaim?.(spot)}
        className="claim-pill"
      >
        Outbid #{spot.rank}
      </button>
    </div>
  );
}
