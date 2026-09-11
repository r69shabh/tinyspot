import React from 'react';
import { SpotElement } from './SpotElement';
import { Wifi, Battery } from 'lucide-react';

export function InsideScreen({
  spots = [],
  mode = 'live',
  currency = 'INR',
  onClaim,
}) {
  // Ranks 6 to 20 sit on the inside unfolded screen (15 spots!)
  // Left folding screen: Ranks 6-13 (8 spots)
  // Right folding screen: Ranks 14-20 (7 spots)
  const leftSpots = Array.from({ length: 8 }, (_, i) => {
    const rank = 6 + i;
    return spots.find(s => s.rank === rank) || { rank, id: `spot-${rank}`, screen: 'inside-left' };
  });

  const rightSpots = Array.from({ length: 7 }, (_, i) => {
    const rank = 14 + i;
    return spots.find(s => s.rank === rank) || { rank, id: `spot-${rank}`, screen: 'inside-right' };
  });

  return (
    <div className="relative mx-auto w-full max-w-[620px] sm:max-w-[700px] select-none">
      {/* Device wrapper */}
      <div className="relative shadow-2xl rounded-[36px] overflow-hidden bg-mist/40 border border-hairline/60">
        {/* Render Image */}
        <img
          src="/iphone-inside-tight.jpg"
          alt="Apple iPhone Fold Unfolded Screen Render"
          className="block h-auto w-full pointer-events-none"
        />

        {/* OLED Screen overlay */}
        <div
          className="absolute overflow-hidden rounded-[26px] bg-[#0c0c0e]"
          style={{
            left: '5.38%',
            top: '6.62%',
            width: '90.37%',
            height: '88.33%',
          }}
        >
          {/* Subtle Apple-style abstract dark wallpaper gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-black pointer-events-none" />

          {/* Center Hinge Crease Shadow & Reflection */}
          <div
            className="absolute inset-y-0 w-3 pointer-events-none z-20"
            style={{
              left: 'calc(50% - 6px)',
              background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.45) 100%)',
            }}
          />

          {/* Status bar */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-2 sm:pt-3 text-[10px] sm:text-[11px] font-semibold text-white/90">
            <div className="flex items-center gap-2">
              <span className="tabular-nums">9:41</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] font-medium text-white/60">
                Inside Screen
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/80">
              <span className="hidden sm:inline text-[9px] text-white/50">Ranks #6–#20</span>
              <span>5G</span>
              <Wifi className="h-3 w-3" />
              <Battery className="h-3 w-3" />
            </div>
          </div>

          {/* Dual Panel Grid Content */}
          <div className="relative z-10 flex h-[calc(100%-36px)] sm:h-[calc(100%-42px)] p-2 sm:p-4">
            {/* Left Folding Display Panel (Ranks #6 to #13) */}
            <div className="flex-1 pr-2 sm:pr-3 flex flex-col justify-between">
              <div className="mb-1 flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  Left Panel · Ranks 6–13
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 flex-1 items-center">
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
            </div>

            {/* Right Folding Display Panel (Ranks #14 to #20) */}
            <div className="flex-1 pl-2 sm:pl-3 flex flex-col justify-between">
              <div className="mb-1 flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  Right Panel · Ranks 14–20
                </span>
                <span className="text-[8px] text-white/40">15 Apps Total</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 flex-1 items-center">
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
                {/* 16th bonus spot or quick claim spot */}
                <div className="flex flex-col items-center justify-center p-1 text-center">
                  <button
                    onClick={() => onClaim?.({ rank: 20, isNext: true })}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-[22%] border border-dashed border-white/30 bg-white/5 text-white/50 hover:border-white hover:text-white transition-all text-xs"
                    title="Bid to enter board"
                  >
                    +
                  </button>
                  <span className="mt-1 text-[8px] font-medium text-white/50">Next Spot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
