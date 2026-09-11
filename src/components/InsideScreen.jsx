import React from 'react';
import { SpotElement } from './SpotElement';
import { Wifi, Battery, Plus } from 'lucide-react';
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
      {/* Pristine authentic CAD render of unfolded iPhone Duo */}
      <div className="relative overflow-hidden rounded-[38px] drop-shadow-2xl">
        <img
          src="/phone-inside-clean.png"
          alt="Apple iPhone Duo Unfolded Inside Screen"
          className="block h-auto w-full pointer-events-none"
        />

        {/* LEFT DISPLAY PANEL (Ranks #6 to #13) - Pixel-aligned to hardware bezels */}
        <div
          className="absolute overflow-hidden flex flex-col justify-between pl-2 sm:pl-3 pr-3 sm:pr-4 pt-2 sm:pt-2.5 pb-1.5 sm:pb-2"
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
              <span className="tabular-nums font-semibold text-white">9:41</span>
              <span className="rounded bg-white/15 px-1 py-0.2 text-[7px] text-white/80 font-bold">
                Left Canvas
              </span>
            </div>
            <span className="text-[8px] sm:text-[8.5px] text-emerald-300 font-bold">#6–#13</span>
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
          <div className="relative z-10 mx-auto h-0.5 w-12 rounded-full bg-white/30" />
        </div>

        {/* RIGHT DISPLAY PANEL (Ranks #14 to #20) - Pixel-aligned to hardware bezels */}
        <div
          className="absolute overflow-hidden flex flex-col justify-between pl-3 sm:pl-4 pr-2 sm:pr-3 pt-2 sm:pt-2.5 pb-1.5 sm:pb-2"
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
            <span className="text-[8px] sm:text-[8.5px] text-emerald-300 font-bold">#14–#20</span>
            <div className="flex items-center gap-1">
              <span className="text-[7.5px] sm:text-[8px] text-white/80 font-bold">5G</span>
              <Wifi className="h-2 w-2 text-white/80" />
              <Battery className="h-2 w-2 text-white/80" />
            </div>
          </div>

          {/* Right Panel Grid: 7 Spots + 1 Backer Slot */}
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
            {/* 8th Balanced Symmetrical Slot: Open Sponsor Spot */}
            <button
              type="button"
              onClick={() => onClaim?.({ rank: 20 })}
              className="group relative flex flex-col items-center justify-center text-center p-0.5 cursor-pointer w-full"
              title="Claim an open inner screen spot"
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-[22%] border border-dashed border-emerald-400/40 bg-emerald-500/10 text-emerald-300 transition-all duration-200 group-hover:scale-105 group-hover:border-emerald-300 group-hover:bg-emerald-500/25">
                <Plus className="h-3 w-3 text-emerald-300" />
              </div>
              <span className="mt-0.5 block w-full truncate text-[7.5px] sm:text-[8px] font-bold text-emerald-300 leading-none">
                + Open Spot
              </span>
            </button>
          </div>

          {/* Right bottom bar */}
          <div className="relative z-10 mx-auto h-0.5 w-12 rounded-full bg-white/30" />
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
