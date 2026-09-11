import React from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { playClick } from '../utils/audio';

export function Footer({
  biddersCount = 20,
  onResetBoard,
}) {
  return (
    <footer className="border-t border-hairline/70 bg-mist/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[16px] font-semibold text-ink">Hey, I'm Rishabh 👋</p>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-2">
            Funding Apple's first iPhone Fold in India (₹2,99,900 / $3,600) by turning the screen everyone glances at into an interactive showcase for great products and builders. Got questions or want to partner? Drop a line at{' '}
            <a
              href="mailto:connect@r69shabh.me"
              className="text-ink font-semibold underline underline-offset-2 hover:text-black"
            >
              connect@r69shabh.me
            </a>.
          </p>
        </div>

        <div className="text-[12px] text-ink-2 space-y-2">
          <div className="flex items-center gap-1.5 text-orange-800 font-medium">
            <ShieldCheck className="h-4 w-4 text-orange-600" />
            <span>tinyspot.lol · Payments processed by Dodo Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Live auction board · {biddersCount} claimed</span>
            <span>·</span>
            <span>Zero ad trackers</span>
          </div>
          <nav className="flex gap-4 pt-1 text-[12px]">
            <a className="hover:text-ink transition-colors" href="#how">How It Works</a>
            <a className="hover:text-ink transition-colors" href="#leaderboard">Leaderboard</a>
            <a className="hover:text-ink transition-colors" href="https://dodopayments.com" target="_blank" rel="noreferrer">Dodo Payments</a>
            <a className="hover:text-ink transition-colors" href="mailto:connect@r69shabh.me">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
