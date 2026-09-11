import React, { useState } from 'react';
import { OutsideScreen } from './OutsideScreen';
import { InsideScreen } from './InsideScreen';
import { Layers, Smartphone, Sparkles, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import { playClick } from '../utils/audio';

export function PhoneShowcase({
  spots = [],
  currency = 'INR',
  onClaim,
  onOpenBidModal,
}) {
  const [view, setView] = useState('dual'); // 'dual' | 'outside' | 'inside' | 'concept'
  const [mode, setMode] = useState('live'); // 'live' | 'final'

  const handleViewChange = (v) => {
    playClick();
    setView(v);
  };

  const handleModeChange = (m) => {
    playClick();
    setMode(m);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 pb-12">
      {/* Interactive Controls Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: View selector pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-mist p-1 text-[13px] font-medium border border-hairline/60 self-start">
          <button
            type="button"
            onClick={() => handleViewChange('dual')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all ${
              view === 'dual'
                ? 'bg-white text-ink shadow-sm font-semibold'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Dual View</span>
          </button>
          <button
            type="button"
            onClick={() => handleViewChange('outside')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all ${
              view === 'outside'
                ? 'bg-white text-ink shadow-sm font-semibold'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-emerald-500" />
            <span>Outside Screen (Top 5)</span>
          </button>
          <button
            type="button"
            onClick={() => handleViewChange('inside')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all ${
              view === 'inside'
                ? 'bg-white text-ink shadow-sm font-semibold'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            <span>Inside Screen (Ranks 6–20)</span>
          </button>
          <button
            type="button"
            onClick={() => handleViewChange('concept')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              view === 'concept'
                ? 'bg-white text-ink shadow-sm font-semibold'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5 text-amber-500" />
            <span>CAD Concept</span>
          </button>
        </div>

        {/* Right: Board Mode Selector (Live Board vs Final Look) */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex rounded-full bg-mist p-1 text-[12px] font-medium border border-hairline/60">
            <button
              type="button"
              onClick={() => handleModeChange('live')}
              className={`rounded-full px-3 py-1 transition-all ${
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
              className={`rounded-full px-3 py-1 transition-all ${
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
        {mode === 'live' ? (
          <span>Hover a rank to take it · Click any logo to visit their site</span>
        ) : (
          <span>Final look · logos and widgets sit directly on the iPhone Fold</span>
        )}
      </p>

      {/* Display Render Area */}
      <div className="relative">
        {view === 'dual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
            {/* Outside Screen (Left col, takes 4.5 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="mb-2 text-center">
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink">
                  <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                  Outside Screen (Top 5)
                </span>
                <p className="text-[11px] text-ink-2">Premier visibility when phone is closed</p>
              </div>
              <OutsideScreen
                spots={spots}
                mode={mode}
                currency={currency}
                onClaim={onClaim}
              />
            </div>

            {/* Inside Screen (Right col, takes 7.5 cols) */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="mb-2 text-center">
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink">
                  <Layers className="h-3.5 w-3.5 text-indigo-600" />
                  Inside Unfolded Screen (Ranks 6–20)
                </span>
                <p className="text-[11px] text-ink-2">15 spots across dual folding panels</p>
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

        {view === 'concept' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-3xl border border-hairline bg-mist/60 p-5 text-center shadow-sm">
              <img
                src="/iphone-fold-flat.png"
                alt="Original concept render: Flat device view"
                className="mx-auto rounded-2xl max-h-[260px] object-contain shadow-sm"
              />
              <h4 className="mt-4 text-[14px] font-semibold text-ink">Flat CAD Concept (Back & Cover Screen)</h4>
              <p className="mt-1 text-[12px] text-ink-2">
                White ceramic chassis, dual-camera visor on rear, outer cover display on front right.
              </p>
            </div>
            <div className="rounded-3xl border border-hairline bg-mist/60 p-5 text-center shadow-sm">
              <img
                src="/iphone-fold-angled.png"
                alt="Original concept render: Angled folding screen"
                className="mx-auto rounded-2xl max-h-[260px] object-contain shadow-sm"
              />
              <h4 className="mt-4 text-[14px] font-semibold text-ink">Angled Hinge Perspective</h4>
              <p className="mt-1 text-[12px] text-ink-2">
                Book-style fold mechanism showing inner OLED folding display at 120° posture.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Primary CTA button under render */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            playClick();
            onOpenBidModal();
          }}
          className="group flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-white shadow-lg transition-all duration-200 hover:bg-black hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Get on the board</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
        <a
          href="#how"
          className="rounded-full border border-hairline bg-white px-5 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-mist"
        >
          How it works ›
        </a>
      </div>
    </section>
  );
}
