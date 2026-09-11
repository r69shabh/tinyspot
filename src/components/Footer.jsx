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
                Apple’s first foldable phone is the most anticipated piece of mobile hardware in a decade. When it arrives in India, it will be the center of attention in every tech hub, conference, coworking space, and coffee shop.
              </p>

              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">
                Rather than letting the screens sit empty with generic wallpapers, <strong className="text-ink font-semibold">tinyspot</strong> turns the device into an interactive physical billboard. 20 permanent slots are dedicated to showcasing world-class SaaS products, developer utilities, indie tools, and creators.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-hairline/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-ink text-white flex items-center justify-center font-bold text-xs">
                  R
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">Rishabh Gusain</div>
                  <div className="text-[11px] text-ink-2">Creator & Maintainer</div>
                </div>
              </div>

              <a
                href="mailto:connect@r69shabh.me"
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-mist/60 px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-mist transition-colors shadow-2xs"
              >
                <Mail className="h-3.5 w-3.5 text-ink-2" />
                <span>connect@r69shabh.me</span>
              </a>
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
                  <dd className="font-semibold text-ink">Apple iPhone Fold (256GB)</dd>
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

          <div className="flex items-center gap-5">
            <a href="#how" className="hover:text-ink transition-colors">How it works</a>
            <a href="#leaderboard" className="hover:text-ink transition-colors">Leaderboard</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
            <a href="https://dodopayments.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors inline-flex items-center gap-0.5">
              <span>Dodo Payments</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <a href="mailto:connect@r69shabh.me" className="hover:text-ink transition-colors">Email</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

