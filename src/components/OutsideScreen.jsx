import React from 'react';
import { SpotElement } from './SpotElement';
import { Wifi, Battery } from 'lucide-react';

export function OutsideScreen({
  spots = [],
  mode = 'live',
  currency = 'USD',
  onClaim,
  showFullDevice = true,
}) {
  const spot1 = spots.find(s => s.rank === 1) || { rank: 1, id: 'spot-1', bidAmount: 780 };
  const spot2 = spots.find(s => s.rank === 2) || { rank: 2, id: 'spot-2', bidAmount: 570 };
  const spot3 = spots.find(s => s.rank === 3) || { rank: 3, id: 'spot-3', bidAmount: 430 };
  const spot4 = spots.find(s => s.rank === 4) || { rank: 4, id: 'spot-4', bidAmount: 350 };
  const spot5 = spots.find(s => s.rank === 5) || { rank: 5, id: 'spot-5', bidAmount: 290 };

  // If showing full device (ceramic back on left + cover screen on right)
  if (showFullDevice) {
    return (
      <div className="relative mx-auto w-full max-w-[560px] sm:max-w-[620px] select-none">
        <div className="relative overflow-hidden rounded-[38px] drop-shadow-2xl">
          {/* Authentic pristine CAD render */}
          <img
            src="/phone-outside-clean.png"
            alt="Apple iPhone Fold Flat (Back and Outside Cover Screen)"
            className="block h-auto w-full pointer-events-none"
          />

          {/* Screen overlay positioned inside the right display bezels */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: '51.48%',
              top: '7.28%',
              width: '42.71%',
              height: '85.29%',
              borderTopRightRadius: '36px',
              borderBottomRightRadius: '36px',
              borderTopLeftRadius: '4px',
              borderBottomLeftRadius: '4px',
              background: 'radial-gradient(ellipse at 50% 15%, #18181c 0%, #09090b 100%)',
            }}
          >
            {/* Status bar */}
            <div className="relative z-10 flex items-center justify-between px-3 pt-2.5 text-[9px] font-semibold text-white/90">
              <span className="tabular-nums font-semibold tracking-tight">9:41</span>
              {/* Dynamic Island / Hardware Punch Hole Camera */}
              <div className="flex items-center gap-1.5 pr-4">
                <span className="text-[8px] text-white/70">5G</span>
                <Wifi className="h-2.5 w-2.5 text-white/80" />
                <Battery className="h-2.5 w-2.5 text-white/80" />
                <div className="ml-1 h-3.5 w-3.5 rounded-full bg-black border border-white/20 shadow-inner flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#111827] ring-1 ring-blue-500/40" />
                </div>
              </div>
            </div>

            {/* Screen Content: Top 5 Spots */}
            <div className="relative z-10 flex h-[calc(100%-34px)] flex-col justify-between px-2 pb-2.5 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/80 border border-white/10">
                  Outside Screen · Top 5
                </span>
                <span className="text-[8px] text-emerald-400 font-medium">$290–$780</span>
              </div>

              {/* Rank 1: Hero Billboard */}
              <div className="h-[34%]">
                <SpotElement
                  spot={spot1}
                  mode={mode}
                  currency={currency}
                  onClaim={onClaim}
                  variant="hero"
                />
              </div>

              {/* Ranks 2 & 3: Companion Tiles */}
              <div className="grid h-[29%] grid-cols-2 gap-1.5">
                <SpotElement
                  spot={spot2}
                  mode={mode}
                  currency={currency}
                  onClaim={onClaim}
                  variant="medium"
                />
                <SpotElement
                  spot={spot3}
                  mode={mode}
                  currency={currency}
                  onClaim={onClaim}
                  variant="medium"
                />
              </div>

              {/* Ranks 4 & 5: Bottom Tiles */}
              <div className="grid h-[25%] grid-cols-2 gap-1.5">
                <SpotElement
                  spot={spot4}
                  mode={mode}
                  currency={currency}
                  onClaim={onClaim}
                  variant="medium"
                />
                <SpotElement
                  spot={spot5}
                  mode={mode}
                  currency={currency}
                  onClaim={onClaim}
                  variant="medium"
                />
              </div>

              {/* Home indicator pill */}
              <div className="mx-auto h-0.5 w-16 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cover Mode Only (Closed Folded Device)
  return (
    <div className="relative mx-auto w-full max-w-[320px] select-none">
      <div className="relative overflow-hidden rounded-[38px] drop-shadow-2xl">
        <img
          src="/phone-cover-clean.png"
          alt="Apple iPhone Fold Cover Screen"
          className="block h-auto w-full pointer-events-none"
        />

        <div
          className="absolute overflow-hidden"
          style={{
            left: '4.29%',
            top: '7.28%',
            width: '84.98%',
            height: '85.29%',
            borderTopRightRadius: '36px',
            borderBottomRightRadius: '36px',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            background: 'radial-gradient(ellipse at 50% 15%, #18181c 0%, #09090b 100%)',
          }}
        >
          {/* Status Bar */}
          <div className="relative z-10 flex items-center justify-between px-4 pt-2.5 text-[10px] font-semibold text-white/90">
            <span className="tabular-nums font-semibold">9:41</span>
            <div className="flex items-center gap-1.5 pr-5">
              <span className="text-[9px] text-white/70">5G</span>
              <Wifi className="h-3 w-3 text-white/80" />
              <Battery className="h-3 w-3 text-white/80" />
              <div className="ml-1 h-3.5 w-3.5 rounded-full bg-black border border-white/20 shadow-inner flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-[#111827] ring-1 ring-blue-500/40" />
              </div>
            </div>
          </div>

          {/* Screen Content: Top 5 Spots */}
          <div className="relative z-10 flex h-[calc(100%-42px)] flex-col justify-between px-2.5 pb-3 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/80 border border-white/10">
                Outside Screen · Top 5
              </span>
              <span className="text-[9px] text-emerald-400 font-medium">$290–$780</span>
            </div>

            <div className="h-[34%]">
              <SpotElement
                spot={spot1}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
                variant="hero"
              />
            </div>

            <div className="grid h-[29%] grid-cols-2 gap-2">
              <SpotElement
                spot={spot2}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
                variant="medium"
              />
              <SpotElement
                spot={spot3}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
                variant="medium"
              />
            </div>

            <div className="grid h-[25%] grid-cols-2 gap-2">
              <SpotElement
                spot={spot4}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
                variant="medium"
              />
              <SpotElement
                spot={spot5}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
                variant="medium"
              />
            </div>

            <div className="mx-auto h-1 w-20 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
