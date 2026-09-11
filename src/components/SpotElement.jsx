import React from 'react';
import { ExternalLink, Plus, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { SPOT_BASE_PRICES } from '../data/initialBoard';

export function SpotElement({
  spot,
  mode = 'live',
  currency = 'USD',
  onClaim,
  variant = 'icon', // 'hero' | 'medium' | 'tile' | 'icon'
}) {
  const isVacant = !spot.brandName;
  const basePrice = spot.bidAmount || SPOT_BASE_PRICES[spot.rank] || 20;

  // Final look: Clean pristine Apple look without overlays
  if (mode === 'final') {
    if (isVacant) {
      // Elegant minimal placeholder on final look
      return (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/30 text-[10px]">
          #{spot.rank}
        </div>
      );
    }

    if (variant === 'hero') {
      return (
        <a
          href={spot.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl p-3 transition-all duration-300 hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold text-white shadow-md"
                style={{ backgroundColor: spot.logoBg || '#1d1d1f' }}
              >
                {spot.logoText || spot.brandName?.slice(0, 2)}
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight text-[13px] leading-snug">{spot.brandName}</h4>
                <span className="text-[10px] text-white/60 font-medium">Rank #1 Sponsor</span>
              </div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-white/40 group-hover:text-white transition-colors" />
          </div>
          <p className="text-[11px] leading-normal text-white/80 line-clamp-2">{spot.tagline}</p>
        </a>
      );
    }

    if (variant === 'medium') {
      return (
        <a
          href={spot.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-2 transition-all duration-300 hover:scale-[1.01]"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: spot.logoBg || '#1d1d1f' }}
            >
              {spot.logoText || spot.brandName?.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="truncate text-[11px] font-semibold text-white">{spot.brandName}</h5>
              <span className="text-[9px] text-white/50">#{spot.rank}</span>
            </div>
          </div>
          <p className="text-[10px] text-white/70 truncate">{spot.tagline}</p>
        </a>
      );
    }

    // Default icon style
    return (
      <a
        href={spot.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center justify-center text-center transition-transform duration-200 hover:scale-105"
      >
        <div
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[22%] text-xs font-bold shadow-md transition-shadow group-hover:shadow-lg"
          style={{
            backgroundColor: spot.logoBg || '#222226',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {spot.logoText || spot.brandName?.slice(0, 2)}
        </div>
        <span className="mt-0.5 w-full truncate text-[9px] font-medium text-white/90 drop-shadow-sm">
          {spot.brandName}
        </span>
      </a>
    );
  }

  // Live Mode: Vacant Spot handling
  if (isVacant) {
    if (variant === 'hero') {
      return (
        <button
          onClick={() => onClaim?.(spot)}
          className="spot-container group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-white/35 bg-white/5 p-3 text-left transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <span className="text-[11px] font-bold text-white">#1 Billboard Spot</span>
                <span className="block text-[9px] text-white/60">Outside Screen Top</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              {formatPrice(basePrice, currency)}
            </span>
          </div>
          <p className="text-[10px] text-white/70">Click to claim the premier #1 slot</p>
          <div className="claim-pill">Claim #{spot.rank} · {formatPrice(basePrice, currency)}</div>
        </button>
      );
    }

    if (variant === 'medium') {
      return (
        <button
          onClick={() => onClaim?.(spot)}
          className="spot-container group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-dashed border-white/30 bg-white/5 p-2 text-left transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/80">Spot #{spot.rank}</span>
            <span className="text-[9px] font-bold text-emerald-300">{formatPrice(basePrice, currency)}</span>
          </div>
          <span className="text-[9px] text-white/50 truncate">+ Click to Claim</span>
          <div className="claim-pill">Claim #{spot.rank} · {formatPrice(basePrice, currency)}</div>
        </button>
      );
    }

    // Vacant icon on inside screen
    return (
      <button
        onClick={() => onClaim?.(spot)}
        className="spot-container group relative flex flex-col items-center justify-center text-center p-0.5"
      >
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[22%] border border-dashed border-white/35 bg-white/5 text-white/60 transition-all group-hover:border-emerald-400 group-hover:bg-emerald-500/15 group-hover:text-emerald-300">
          <Plus className="h-3.5 w-3.5" />
        </div>
        <span className="mt-0.5 w-full truncate text-[8px] font-medium text-white/70">
          #{spot.rank}
        </span>
        <span className="text-[7.5px] font-semibold text-emerald-300 leading-none">
          {formatPrice(basePrice, currency)}
        </span>
        <div className="claim-pill">Claim #{spot.rank} · {formatPrice(basePrice, currency)}</div>
      </button>
    );
  }

  // Live Mode: Claimed spots
  if (variant === 'hero') {
    return (
      <div className="spot-container group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-2.5 sm:p-3 backdrop-blur-xl transition-all duration-200 hover:border-white/40 hover:bg-black/60 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
              style={{ backgroundColor: spot.logoBg || '#1d1d1f' }}
            >
              {spot.logoText || spot.brandName?.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="rounded-full bg-emerald-500/20 px-1 py-0.2 text-[8px] font-semibold text-emerald-400 border border-emerald-500/30">
                  #1 LEADER
                </span>
                <span className="text-[10px] font-semibold text-white/90">
                  {formatPrice(spot.bidAmount, currency)}
                </span>
              </div>
              <h4 className="truncate text-[12px] font-bold text-white leading-tight">{spot.brandName}</h4>
            </div>
          </div>
          <a
            href={spot.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full bg-white/10 p-1 text-white/70 hover:bg-white/20 hover:text-white"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="mt-1 text-[10px] text-white/75 line-clamp-2">{spot.tagline}</p>
        <button
          onClick={() => onClaim?.(spot)}
          className="claim-pill"
        >
          Outbid #{spot.rank} · {formatPrice(spot.bidAmount + 5, currency)}
        </button>
      </div>
    );
  }

  if (variant === 'medium') {
    return (
      <div className="spot-container group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-black/40 p-1.5 sm:p-2 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-black/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold shadow-sm"
              style={{ backgroundColor: spot.logoBg || '#1d1d1f' }}
            >
              {spot.logoText || spot.brandName?.slice(0, 2)}
            </div>
            <div className="min-w-0 truncate">
              <span className="text-[8px] font-bold text-white/50">#{spot.rank}</span>
              <h5 className="truncate text-[10px] font-semibold text-white leading-tight">{spot.brandName}</h5>
            </div>
          </div>
          <span className="text-[9px] font-semibold text-emerald-400">
            {formatPrice(spot.bidAmount, currency)}
          </span>
        </div>
        <p className="text-[9px] text-white/70 truncate">{spot.tagline}</p>
        <button
          onClick={() => onClaim?.(spot)}
          className="claim-pill"
        >
          Outbid #{spot.rank}
        </button>
      </div>
    );
  }

  // App Icon style (Ranks #6-#20)
  return (
    <div className="spot-container group relative flex flex-col items-center justify-center text-center p-0.5">
      <div className="relative">
        <div
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[22%] text-xs font-bold shadow-md transition-all duration-200 group-hover:scale-105"
          style={{
            backgroundColor: spot.logoBg || '#222226',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {spot.logoText || spot.brandName?.slice(0, 2)}
        </div>
        <span className="absolute -top-1 -right-1 rounded-full bg-ink/90 px-1 py-0.2 text-[7px] font-bold text-white/90 border border-white/20">
          #{spot.rank}
        </span>
      </div>
      <span className="mt-0.5 w-full truncate text-[8.5px] font-medium text-white/90 drop-shadow-sm">
        {spot.brandName}
      </span>
      <span className="text-[7.5px] text-emerald-300 font-semibold leading-none">
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
