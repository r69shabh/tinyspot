import React from 'react';
import { SpotElement } from './SpotElement';
import { Wifi, Battery } from 'lucide-react';
import { SPOT_BASE_PRICES } from '../data/initialBoard';

export function InsideScreen({
  spots = [],
  mode = 'live',
  currency = 'USD',
  onClaim,
}) {
  // Ranks 6 to 20 sit on the inside unfolded screen (15 spots)
  // Left folding display: Ranks 6-13 (8 spots)
  // Right folding display: Ranks 14-20 (7 spots)
  const leftSpots = Array.from({ length: 8 }, (_, i) => {
    const rank = 6 + i;
    return spots.find(s => s.rank === rank) || {
      rank,
      id: `spot-${rank}`,
      screen: 'inside-left',
      bidAmount: SPOT_BASE_PRICES[rank] || 50,
      brandName: null,
    };
  });

  const rightSpots = Array.from({ length: 7 }, (_, i) => {
    const rank = 14 + i;
    return spots.find(s => s.rank === rank) || {
      rank,
      id: `spot-${rank}`,
      screen: 'inside-right',
      bidAmount: SPOT_BASE_PRICES[rank] || 25,
      brandName: null,
    };
  });

  return (
    <div className="relative mx-auto w-full max-w-[680px] sm:max-w-[760px] select-none">
      {/* Pristine authentic CAD render of unfolded iPhone Fold */}
      <div className="relative overflow-hidden rounded-[38px] drop-shadow-2xl">
        <img
          src="/phone-inside-clean.png"
          alt="Apple iPhone Fold Unfolded Inside Screen"
          className="block h-auto w-full pointer-events-none"
        />

        {/* LEFT DISPLAY PANEL (Ranks #6 to #13) - Pixel-aligned to hardware bezels */}
        <div
          className="absolute overflow-hidden flex flex-col justify-between p-2 sm:p-3"
          style={{
            left: '30.65%',
            top: '6.74%',
            width: '30.29%',
            height: '86.88%',
            clipPath: 'polygon(0% 0%, 100% 3.88%, 100% 96.33%, 0% 100%)',
            borderTopLeftRadius: '24px',
            borderBottomLeftRadius: '24px',
            background: 'radial-gradient(ellipse at 50% 15%, #18181f 0%, #09090c 100%)',
          }}
        >
          {/* Subtle panel reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none" />

          {/* Left panel header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1 text-[8px] sm:text-[9px] font-semibold text-white/90">
            <div className="flex items-center gap-1">
              <span className="tabular-nums font-semibold">9:41</span>
              <span className="hidden xs:inline rounded-full bg-white/10 px-1 py-0.2 text-[7px] text-white/70">
                Left
              </span>
            </div>
            <span className="text-[8px] text-emerald-400 font-medium">#6–#13 · $55–$160</span>
          </div>

          {/* Left Panel Grid: 8 Spots */}
          <div className="relative z-10 grid grid-cols-2 gap-1 sm:gap-1.5 flex-1 items-center py-1">
            {leftSpots.map(spot => (
              <SpotElement
                key={spot.id}
                spot={spot}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
                variant="icon"
              />
            ))}
          </div>

          {/* Left bottom bar */}
          <div className="relative z-10 mx-auto h-0.5 w-12 rounded-full bg-white/20" />
        </div>

        {/* RIGHT DISPLAY PANEL (Ranks #14 to #20) - Pixel-aligned to hardware bezels */}
        <div
          className="absolute overflow-hidden flex flex-col justify-between p-2 sm:p-3"
          style={{
            left: '60.94%',
            top: '7.45%',
            width: '33.41%',
            height: '86.52%',
            clipPath: 'polygon(0% 3.07%, 100% 0%, 100% 100%, 0% 95.91%)',
            borderTopRightRadius: '24px',
            borderBottomRightRadius: '24px',
            background: 'radial-gradient(ellipse at 50% 15%, #18181f 0%, #09090c 100%)',
          }}
        >
          {/* Subtle panel reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none" />

          {/* Right panel header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1 text-[8px] sm:text-[9px] font-semibold text-white/90">
            <span className="text-[8px] text-emerald-400 font-medium">#14–#20 · $20–$50</span>
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-white/70">5G</span>
              <Wifi className="h-2 w-2" />
              <Battery className="h-2 w-2" />
            </div>
          </div>

          {/* Right Panel Grid: 7 Spots + 1 Vacant Slot */}
          <div className="relative z-10 grid grid-cols-2 gap-1 sm:gap-1.5 flex-1 items-center py-1">
            {rightSpots.map(spot => (
              <SpotElement
                key={spot.id}
                spot={spot}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
                variant="icon"
              />
            ))}
            {/* Vacant / Add Spot Indicator */}
            <div className="flex flex-col items-center justify-center p-0.5 text-center">
              <button
                type="button"
                onClick={() => onClaim?.({ rank: 20 })}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-[22%] border border-dashed border-white/30 bg-white/5 text-white/50 hover:border-white hover:text-white transition-all text-xs"
                title="Claim Vacant Spot #20"
              >
                +
              </button>
              <span className="mt-0.5 text-[7px] font-medium text-white/40">Vacant</span>
            </div>
          </div>

          {/* Right bottom bar */}
          <div className="relative z-10 mx-auto h-0.5 w-12 rounded-full bg-white/20" />
        </div>

        {/* Realistic center hinge reflection seam */}
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: '60.8%',
            top: '10.1%',
            bottom: '9.6%',
            width: '2px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.8) 50%, rgba(255,255,255,0.2) 100%)',
          }}
        />
      </div>
    </div>
  );
}
