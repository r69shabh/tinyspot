import React, { useState } from 'react';
import { OutsideScreen } from './OutsideScreen';
import { InsideScreen } from './InsideScreen';
import { Layers, Smartphone, Sparkles, ArrowUpRight } from 'lucide-react';
import { playClick } from '../utils/audio';

export function PhoneShowcase({
  spots = [],
  currency = 'USD',
  onClaim,
  onOpenBidModal,
}) {
  const [view, setView] = useState('dual'); // 'dual' | 'outside' | 'inside'
  const [mode, setMode] = useState('live'); // 'live' | 'final'
  const [coverMode, setCoverMode] = useState('full'); // 'full' (with back) | 'cover' (folded)

  const handleViewChange = (v) => {
    playClick();
    setView(v);
  };

  const handleModeChange = (m) => {
    playClick();
    setMode(m);
  };

  const claimedCount = spots.filter(s => s.brandName).length;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 pb-12">
      {/* Interactive Controls Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: View selector pills */}
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-1 rounded-full bg-mist p-1 text-xs sm:text-[13px] font-medium border border-hairline/60">
          <button
            type="button"
            onClick={() => handleViewChange('dual')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1.5 transition-all ${
              view === 'dual'
                ? 'bg-white text-ink shadow-sm font-semibold'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span className="hidden sm:inline">Dual View</span>
            <span className="sm:hidden">Dual</span>
          </button>
          <button
            type="button"
            onClick={() => handleViewChange('outside')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1.5 transition-all ${
              view === 'outside'
                ? 'bg-white text-ink shadow-sm font-semibold'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Outside Screen (Top 5)</span>
            <span className="sm:hidden">Outside (1–5)</span>
          </button>
          <button
            type="button"
            onClick={() => handleViewChange('inside')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1.5 transition-all ${
              view === 'inside'
                ? 'bg-white text-ink shadow-sm font-semibold'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Inside Screen (Ranks 6–20)</span>
            <span className="sm:hidden">Inside (6–20)</span>
          </button>
        </div>

        {/* Right: Board Mode Selector (Live Board vs Final Look) */}
        <div className="flex items-center justify-end gap-2.5 self-end sm:self-auto w-full sm:w-auto">
          {view === 'outside' && (
            <div className="flex rounded-full bg-mist p-0.5 text-[11px] font-medium border border-hairline/60">
              <button
                type="button"
                onClick={() => setCoverMode('full')}
                className={`rounded-full px-2 py-0.5 transition-all ${
                  coverMode === 'full' ? 'bg-white text-ink shadow-xs font-semibold' : 'text-ink-2'
                }`}
              >
                Flat
              </button>
              <button
                type="button"
                onClick={() => setCoverMode('cover')}
                className={`rounded-full px-2 py-0.5 transition-all ${
                  coverMode === 'cover' ? 'bg-white text-ink shadow-xs font-semibold' : 'text-ink-2'
                }`}
              >
                Cover
              </button>
            </div>
          )}

          <div className="flex rounded-full bg-mist p-0.5 sm:p-1 text-[11px] sm:text-[12px] font-medium border border-hairline/60">
            <button
              type="button"
              onClick={() => handleModeChange('live')}
              className={`rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 transition-all ${
                mode === 'live'
                  ? 'bg-white text-ink shadow-sm font-semibold'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Live board
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('final')}
              className={`rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 transition-all ${
                mode === 'final'
                  ? 'bg-white text-ink shadow-sm font-semibold'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Final look
            </button>
          </div>
        </div>
      </div>

      {/* Helper caption */}
      <p className="mb-6 text-center text-[13px] text-ink-2">
        {claimedCount === 0 ? (
          <span>Board is live · Click any vacant spot (+) or use the button below to claim a spot</span>
        ) : (
          <span>Hover a rank to take it · Click any logo to visit their site</span>
        )}
      </p>

      {/* Display Render Area */}
      <div className="relative">
        {view === 'dual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
            {/* Outside Screen (Left, takes 5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="mb-2 text-center">
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink">
                  <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                  Outside Screen (Top 5)
                </span>
                <p className="text-[11px] text-ink-2">Prime cover tier ($50–$150) · Maximum daily glanceability</p>
              </div>
              <OutsideScreen
                spots={spots}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
                showFullDevice={true}
              />
            </div>

            {/* Inside Screen (Right, takes 7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="mb-2 text-center">
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink">
                  <Layers className="h-3.5 w-3.5 text-indigo-600" />
                  Inside Screen (Ranks 6–20)
                </span>
                <p className="text-[11px] text-ink-2">15 spots ($10–$35) across dual folding canvas</p>
              </div>
              <InsideScreen
                spots={spots}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
              />
            </div>
          </div>
        )}

        {view === 'outside' && (
          <div className="flex flex-col items-center py-4">
            <OutsideScreen
              spots={spots}
              mode={mode}
              currency={currency}
              onClaim={onClaim}
              showFullDevice={coverMode === 'full'}
            />
          </div>
        )}

        {view === 'inside' && (
          <div className="flex flex-col items-center py-4">
            <InsideScreen
              spots={spots}
              mode={mode}
              currency={currency}
              onClaim={onClaim}
            />
          </div>
        )}
      </div>

      {/* Primary CTA */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row w-full max-w-xs sm:max-w-none mx-auto">
        <button
          type="button"
          onClick={() => {
            playClick();
            onOpenBidModal();
          }}
          className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-3.5 text-[15px] font-bold text-white shadow-lg transition-all duration-200 hover:bg-orange-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Claim a Spot on iPhone Duo</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
        <a
          href="#how"
          className="w-full sm:w-auto text-center rounded-full border border-hairline bg-white px-5 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-mist"
        >
          How it works ›
        </a>
      </div>
    </section>
  );
}
