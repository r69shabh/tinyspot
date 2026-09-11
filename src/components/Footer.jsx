import React from 'react';
import { ShieldCheck, Mail, Cpu, Terminal, ArrowUpRight } from 'lucide-react';

export function Footer({
  biddersCount = 0,
}) {
  return (
    <footer className="border-t border-hairline/80 bg-gradient-to-b from-mist/20 to-mist/60 text-ink">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
        {/* Campaign Story & Specs Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12">
          {/* Left Column: Creator Note & Vision (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-hairline/80 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-900 border border-orange-200">
                  <span>🇮🇳</span> Delhi NCR, India
                </span>
                <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-semibold text-ink-2">
                  Indie Experiment
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                About the tinyspot Canvas
              </h3>

              <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
                Apple’s first foldable phone, the <strong className="text-ink font-semibold">iPhone Duo</strong>, is the most anticipated piece of mobile hardware in a decade. When it arrives in India, it will be the center of attention in every tech hub, conference, coworking space, and coffee shop.
              </p>

              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">
                Rather than letting the screens sit empty with generic wallpapers, <strong className="text-ink font-semibold">tinyspot</strong> turns the device into an interactive physical billboard. 20 permanent slots are dedicated to showcasing world-class SaaS products, developer utilities, indie tools, and creators.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-hairline/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-ink text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  R
                </div>
                <div>
                  <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <span>Rishabh Gusain</span>
                    <span className="text-[10px] text-ink-2 font-normal">(@r69shabh)</span>
                  </div>
                  <div className="text-[11px] text-ink-2">Creator & Maintainer</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://x.com/r69shabh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white hover:bg-mist px-3 py-1.5 text-xs font-semibold text-ink transition-colors shadow-2xs"
                  title="Follow Rishabh on X"
                >
                  <svg className="h-3 w-3 text-ink" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>@r69shabh</span>
                </a>

                <a
                  href="https://github.com/r69shabh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white hover:bg-mist px-3 py-1.5 text-xs font-semibold text-ink transition-colors shadow-2xs"
                  title="View GitHub profile"
                >
                  <svg className="h-3.5 w-3.5 text-ink" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>r69shabh</span>
                </a>

                <a
                  href="mailto:connect@r69shabh.me"
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-mist/80 hover:bg-mist px-3 py-1.5 text-xs font-semibold text-ink transition-colors shadow-2xs"
                >
                  <Mail className="h-3.5 w-3.5 text-ink-2" />
                  <span>connect@r69shabh.me</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Hardware & Auction Specs (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-hairline/80 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-2 flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 text-ink" />
                  Campaign Specifications
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Verified
                </span>
              </div>

              <dl className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-hairline/40">
                  <dt className="text-ink-2">Hardware Target</dt>
                  <dd className="font-semibold text-ink">Apple iPhone Duo (256GB)</dd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-hairline/40">
                  <dt className="text-ink-2">India Retail Price</dt>
                  <dd className="font-semibold text-ink">₹2,99,900 INR ($3,600 USD)</dd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-hairline/40">
                  <dt className="text-ink-2">Outside Cover Slots</dt>
                  <dd className="font-semibold text-ink">Top 5 Spots ($290–$780)</dd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-hairline/40">
                  <dt className="text-ink-2">Inside Canvas Slots</dt>
                  <dd className="font-semibold text-ink">15 Spots ($20–$160)</dd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-hairline/40">
                  <dt className="text-ink-2">Merchant of Record</dt>
                  <dd className="font-semibold text-orange-900">Dodo Payments</dd>
                </div>
                <div className="flex justify-between items-center py-1">
                  <dt className="text-ink-2">Privacy & Tracking</dt>
                  <dd className="font-semibold text-emerald-700">0 Trackers · 0 Cookies</dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 rounded-xl bg-mist/50 p-3 border border-hairline/60 flex items-center justify-between text-[11px]">
              <span className="text-ink-2">Live Claims</span>
              <span className="font-bold text-ink">{biddersCount} of 20 Claimed</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Copyright Bar */}
        <div className="pt-8 border-t border-hairline/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink">tinyspot.lol</span>
            <span>·</span>
            <span>© 2026 Rishabh Gusain. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <a href="#how" className="hover:text-ink transition-colors">How it works</a>
            <a href="#leaderboard" className="hover:text-ink transition-colors">Leaderboard</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
            <a href="https://x.com/r69shabh" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">X (@r69shabh)</a>
            <a href="https://github.com/r69shabh" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">GitHub</a>
            <a href="https://dodopayments.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors inline-flex items-center gap-0.5">
              <span>Dodo Payments</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <a href="mailto:connect@r69shabh.me" className="hover:text-ink transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

