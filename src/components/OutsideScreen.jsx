import React from 'react';
import { SpotElement } from './SpotElement';
import { Wifi, Battery } from 'lucide-react';

export function OutsideScreen({
  spots = [],
  mode = 'live',
  currency = 'INR',
  onClaim,
}) {
  // Top 5 spots for the outside cover screen
  const spot1 = spots.find(s => s.rank === 1) || { rank: 1, id: 'spot-1' };
  const spot2 = spots.find(s => s.rank === 2) || { rank: 2, id: 'spot-2' };
  const spot3 = spots.find(s => s.rank === 3) || { rank: 3, id: 'spot-3' };
  const spot4 = spots.find(s => s.rank === 4) || { rank: 4, id: 'spot-4' };
  const spot5 = spots.find(s => s.rank === 5) || { rank: 5, id: 'spot-5' };

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] select-none">
      {/* Container maintaining aspect ratio of the phone render */}
      <div className="relative shadow-2xl rounded-[44px] overflow-hidden bg-mist/50 border border-hairline/60">
        {/* Device render image */}
        <img
          src="/iphone-outside-tight.jpg"
          alt="Apple iPhone Fold Cover Screen Render"
          className="block h-auto w-full pointer-events-none"
        />

        {/* OLED Screen Area overlay matching exact pixel measurements */}
        <div
          className="absolute overflow-hidden rounded-[36px]"
          style={{
            left: '9.24%',
            top: '2.75%',
            width: '84.49%',
            height: '94.50%',
            background: 'radial-gradient(circle at 50% 20%, #1e1e24 0%, #0a0a0c 100%)',
          }}
        >
          {/* Subtle wallpaper gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/30 pointer-events-none" />

          {/* Status Bar */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-3 text-[11px] font-semibold text-white/90">
            <span className="tabular-nums">9:41</span>
            
            {/* Punch hole camera representation on top right */}
            <div className="flex items-center gap-2 pr-6">
              <div className="flex items-center gap-1 text-[10px] font-medium text-white/70">
                <span>5G</span>
                <Wifi className="h-3 w-3" />
                <Battery className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Screen Content: Top 5 Spots Layout */}
          <div className="relative z-10 flex h-[calc(100%-48px)] flex-col justify-between px-3 pb-4 pt-2">
            {/* Screen Header Badge */}
            <div className="flex items-center justify-between px-1">
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/70 border border-white/10">
                Outside Screen · Top 5
              </span>
              <span className="text-[10px] text-white/50 font-medium">Cover Display</span>
            </div>

            {/* Rank 1: Hero Billboard Widget */}
            <div className="h-[34%]">
              <SpotElement
                spot={spot1}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
                variant="hero"
              />
            </div>

            {/* Ranks 2 & 3: Medium companion widgets */}
            <div className="grid h-[30%] grid-cols-2 gap-2">
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

            {/* Ranks 4 & 5: Bottom App Tiles */}
            <div className="grid h-[24%] grid-cols-2 gap-2">
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

            {/* iOS Home Indicator */}
            <div className="mx-auto mt-1 h-1 w-24 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
