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
          <p className="text-[16px] font-semibold text-ink">Hey, I carry the Fold 👋</p>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-2">
            Solo founder in India, phone out all day. I'm funding the first Apple iPhone Fold ($3,600 / ₹2,99,900) by renting the home screens everyone already stares at. Questions, or want a spot? Email{' '}
            <a
              href="mailto:koyalhq@gmail.com"
              className="text-ink font-medium underline underline-offset-2 hover:text-black"
            >
              koyalhq@gmail.com
            </a>.
          </p>
        </div>

        <div className="text-[12px] text-ink-2 space-y-2">
          <div className="flex items-center gap-1.5 text-orange-800 font-medium">
            <ShieldCheck className="h-4 w-4 text-orange-600" />
            <span>tinyspot.lol · Checkout powered by Dodo Payments</span>
          </div>
          <div className="flex items-center gap-3">
            <span>live board · {biddersCount} ranked</span>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset board to default sponsors?')) {
                  playClick();
                  onResetBoard();
                }
              }}
              className="inline-flex items-center gap-1 text-ink-2 hover:text-ink font-medium underline"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Demo Data
            </button>
          </div>
          <nav className="flex gap-4 pt-1 text-[12px]">
            <a className="hover:text-ink transition-colors" href="#how">How It Works</a>
            <a className="hover:text-ink transition-colors" href="#leaderboard">Leaderboard</a>
            <a className="hover:text-ink transition-colors" href="https://dodopayments.com" target="_blank" rel="noreferrer">Dodo Payments</a>
            <a className="hover:text-ink transition-colors" href="mailto:koyalhq@gmail.com">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
