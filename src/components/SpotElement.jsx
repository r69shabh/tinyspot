import React, { useState } from 'react';
import { ExternalLink, Plus, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { SPOT_BASE_PRICES } from '../data/initialBoard';

// Resilient Logo Component with image error fallback
function SpotLogo({
  logoUrl,
  logoText,
  brandName,
  logoBg = '#1d1d1f',
  sizeClass = 'h-7 w-7 rounded-lg text-xs',
}) {
  const [imgError, setImgError] = useState(false);
  const initials = logoText || (brandName ? brandName.slice(0, 2).toUpperCase() : '★');

  if (logoUrl && !imgError) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden border border-white/20 shadow-md ${sizeClass}`}
        style={{ backgroundColor: logoBg || '#ffffff' }}
      >
        <img
          src={logoUrl}
          alt={brandName || 'Logo'}
          className="h-full w-full object-contain p-0.5"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-bold text-white shadow-md border border-white/15 ${sizeClass}`}
      style={{ backgroundColor: logoBg }}
    >
      <span>{initials}</span>
    </div>
  );
}

export function SpotElement({
  spot,
  mode = 'live',
  currency = 'USD',
  onClaim,
  variant = 'icon', // 'hero' | 'medium' | 'icon'
}) {
  const isVacant = !spot.brandName;
  const basePrice = spot.bidAmount || SPOT_BASE_PRICES[spot.rank] || 20;

  // Final look: Minimal Apple preview
  if (mode === 'final') {
    if (isVacant) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/30 text-[10px] font-medium">
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
          className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl p-2.5 sm:p-3 transition-all duration-200 hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SpotLogo
                logoUrl={spot.logoUrl}
                logoText={spot.logoText}
                brandName={spot.brandName}
                logoBg={spot.logoBg}
                sizeClass="h-8 w-8 rounded-xl text-sm"
              />
              <div className="min-w-0">
                <h4 className="font-semibold text-white tracking-tight text-[12px] sm:text-[13px] leading-snug truncate">
                  {spot.brandName}
                </h4>
                <span className="text-[9px] text-white/70 font-medium">Rank #1 Sponsor</span>
              </div>
            </div>
            <ExternalLink className="h-3 w-3 text-white/60 group-hover:text-white transition-colors shrink-0" />
          </div>
          <p className="text-[10px] leading-snug text-white/80 line-clamp-2 mt-1">
            {spot.tagline || 'Official launch sponsor'}
          </p>
        </a>
      );
    }

    if (variant === 'medium') {
      return (
        <a
          href={spot.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-1.5 sm:p-2 transition-all duration-200 hover:scale-[1.01]"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <SpotLogo
              logoUrl={spot.logoUrl}
              logoText={spot.logoText}
              brandName={spot.brandName}
              logoBg={spot.logoBg}
              sizeClass="h-6 w-6 rounded-lg text-[10px]"
            />
            <div className="min-w-0 flex-1">
              <h5 className="truncate text-[10px] font-semibold text-white">{spot.brandName}</h5>
              <span className="text-[8px] text-white/60">#{spot.rank}</span>
            </div>
          </div>
          <p className="text-[9px] text-white/70 truncate mt-0.5">{spot.tagline}</p>
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
        <SpotLogo
          logoUrl={spot.logoUrl}
          logoText={spot.logoText}
          brandName={spot.brandName}
          logoBg={spot.logoBg}
          sizeClass="h-8 w-8 sm:h-9 sm:w-9 rounded-[22%] text-xs"
        />
        <span className="mt-0.5 w-full truncate text-[8.5px] font-medium text-white/90 drop-shadow-sm">
          {spot.brandName}
        </span>
      </a>
    );
  }

  // ==========================================
  // LIVE MODE: VACANT SPOTS
  // ==========================================
  if (isVacant) {
    if (variant === 'hero') {
      return (
        <button
          type="button"
          onClick={() => onClaim?.(spot)}
          className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-white/40 bg-gradient-to-br from-white/10 to-white/5 p-2 sm:p-2.5 text-left transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-500/15 cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="h-3 w-3" />
              </span>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                  #1 Billboard
                </span>
                <span className="block text-[8px] sm:text-[8.5px] text-white/70 truncate">
                  Outside Screen Top
                </span>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-500/25 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
              {formatPrice(basePrice, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between w-full pt-1 border-t border-white/10">
            <span className="text-[8.5px] sm:text-[9.5px] font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
              + Claim Premier Slot
            </span>
            <span className="text-[7.5px] sm:text-[8px] text-white/50 uppercase tracking-wider font-semibold">
              Tap to Bid
            </span>
          </div>
        </button>
      );
    }

    if (variant === 'medium') {
      return (
        <button
          type="button"
          onClick={() => onClaim?.(spot)}
          className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-dashed border-white/30 bg-white/5 p-1.5 sm:p-2 text-left transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-500/15 cursor-pointer"
        >
          {/* Top row: Rank badge + Price */}
          <div className="flex items-center justify-between w-full">
            <span className="rounded bg-white/10 px-1 py-0.2 text-[8px] sm:text-[8.5px] font-bold text-white/90 border border-white/15">
              #{spot.rank}
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] font-bold text-emerald-300">
              {formatPrice(basePrice, currency)}
            </span>
          </div>

          {/* Bottom row: Clean + Claim Callout */}
          <div className="flex items-center gap-1 text-[8.5px] sm:text-[9px] font-medium text-white/80 group-hover:text-emerald-300 transition-colors truncate">
            <Plus className="h-2.5 w-2.5 shrink-0 text-emerald-400" />
            <span className="truncate">Claim Spot</span>
          </div>
        </button>
      );
    }

    // Vacant icon for inside screen (#6 to #20)
    return (
      <button
        type="button"
        onClick={() => onClaim?.(spot)}
        className="group relative flex flex-col items-center justify-center text-center p-0.5 cursor-pointer w-full"
      >
        {/* iOS style Squircle Icon */}
        <div className="relative">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-[22%] border border-dashed border-white/35 bg-white/10 text-white/70 shadow-xs transition-all duration-200 group-hover:scale-105 group-hover:border-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-200">
            <Plus className="h-3 w-3" />
          </div>
          {/* Crisp Rank Badge */}
          <span className="absolute -top-1 -right-1 rounded-full bg-black/80 px-1 py-0.2 text-[7px] font-bold text-white border border-white/20">
            #{spot.rank}
          </span>
        </div>

        {/* Clear readable price label */}
        <span className="mt-0.5 block w-full truncate text-[8px] sm:text-[8.5px] font-bold text-emerald-300 leading-none drop-shadow-xs">
          {formatPrice(basePrice, currency)}
        </span>
      </button>
    );
  }

  // ==========================================
  // LIVE MODE: CLAIMED SPOTS
  // ==========================================
  if (variant === 'hero') {
    return (
      <div className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/25 bg-black/50 p-2 sm:p-2.5 backdrop-blur-xl transition-all duration-200 hover:border-white/40 hover:bg-black/70 shadow-lg">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 min-w-0">
            <SpotLogo
              logoUrl={spot.logoUrl}
              logoText={spot.logoText}
              brandName={spot.brandName}
              logoBg={spot.logoBg}
              sizeClass="h-7 w-7 sm:h-8 sm:w-8 rounded-xl text-xs"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="rounded-full bg-emerald-500/25 px-1.5 py-0.2 text-[7.5px] font-bold text-emerald-300 border border-emerald-500/40">
                  #1 LEADER
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-white">
                  {formatPrice(spot.bidAmount, currency)}
                </span>
              </div>
              <h4 className="truncate text-[11px] sm:text-[12px] font-bold text-white leading-tight">
                {spot.brandName}
              </h4>
            </div>
          </div>
          <a
            href={spot.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full bg-white/10 p-1 text-white/70 hover:bg-white/20 hover:text-white shrink-0 transition-colors"
            title="Visit sponsor website"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <p className="text-[9px] sm:text-[9.5px] text-white/80 line-clamp-1 mt-0.5">
          {spot.tagline || 'Official #1 launch sponsor'}
        </p>

        <button
          type="button"
          onClick={() => onClaim?.(spot)}
          className="mt-1 flex items-center justify-between w-full rounded-lg bg-white/10 hover:bg-emerald-500/25 px-2 py-0.5 text-[8.5px] font-semibold text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
        >
          <span>Outbid #1</span>
          <span>+{formatPrice(5, currency)}</span>
        </button>
      </div>
    );
  }

  if (variant === 'medium') {
    return (
      <div className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-white/20 bg-black/50 p-1.5 sm:p-2 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-black/70">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 min-w-0">
            <SpotLogo
              logoUrl={spot.logoUrl}
              logoText={spot.logoText}
              brandName={spot.brandName}
              logoBg={spot.logoBg}
              sizeClass="h-5 w-5 sm:h-6 sm:w-6 rounded-lg text-[9px]"
            />
            <div className="min-w-0 truncate">
              <span className="text-[7.5px] font-bold text-white/60">#{spot.rank}</span>
              <h5 className="truncate text-[9.5px] sm:text-[10px] font-bold text-white leading-tight">
                {spot.brandName}
              </h5>
            </div>
          </div>
          <span className="text-[8.5px] sm:text-[9.5px] font-bold text-emerald-300 shrink-0">
            {formatPrice(spot.bidAmount, currency)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onClaim?.(spot)}
          className="mt-0.5 flex items-center justify-between w-full rounded bg-white/10 hover:bg-emerald-500/25 px-1.5 py-0.2 text-[8px] font-semibold text-emerald-300 border border-emerald-500/20 transition-colors cursor-pointer"
        >
          <span>Outbid</span>
          <span>+{formatPrice(5, currency)}</span>
        </button>
      </div>
    );
  }

  // App Icon Style (Claimed, Ranks #6-#20)
  return (
    <div className="group relative flex flex-col items-center justify-center text-center p-0.5 w-full">
      <div className="relative">
        <SpotLogo
          logoUrl={spot.logoUrl}
          logoText={spot.logoText}
          brandName={spot.brandName}
          logoBg={spot.logoBg}
          sizeClass="h-7 w-7 sm:h-8 sm:w-8 rounded-[22%] text-[10px] sm:text-xs group-hover:scale-105 transition-transform"
        />
        <span className="absolute -top-1 -right-1 rounded-full bg-black/85 px-1 py-0.2 text-[7px] font-bold text-white border border-white/25">
          #{spot.rank}
        </span>
      </div>

      <span className="mt-0.5 block w-full truncate text-[8px] sm:text-[8.5px] font-medium text-white/95 drop-shadow-xs">
        {spot.brandName}
      </span>
      <button
        type="button"
        onClick={() => onClaim?.(spot)}
        className="text-[7.5px] sm:text-[8px] text-emerald-300 font-bold hover:underline leading-none cursor-pointer"
        title={`Click to outbid rank #${spot.rank}`}
      >
        {formatPrice(spot.bidAmount, currency)}
      </button>
    </div>
  );
}

