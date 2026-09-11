import React, { useState } from 'react';
import { ChevronDown, Smartphone, Zap, Globe, ShieldCheck, Sparkles, Mail } from 'lucide-react';
import { playClick } from '../utils/audio';

export function FAQ() {
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    {
      id: 'hardware',
      icon: Smartphone,
      category: 'The Hardware',
      q: 'Where and how will this iPhone Duo actually be seen?',
      summary: 'Daily in-person presence across Delhi NCR & Bangalore, plus viral social demos.',
      detail:
        'The iPhone Duo will serve as Rishabh’s primary, daily-driven phone in India. It will be actively used at founder meetups, coffee shops, coworking spaces, tech conferences, and airport lounges. Every public fold/unfold interaction turns your logo into the focal point. In addition, video demos, device unboxings, and screen recordings will be shared regularly on X/Twitter and YouTube, creating recurring online impressions.',
    },
    {
      id: 'outbid',
      icon: Zap,
      category: 'Auction Mechanics',
      q: 'How does outbidding work, and what if someone takes my slot?',
      summary: 'Outbid by +$5 (+₹500). Outbid sponsors gracefully shift down—never deleted.',
      detail:
        'Any open spot can be claimed at its starting base price. If another sponsor wishes to take your specific rank, they must outbid you by at least $5 USD (₹500 INR). When that happens, you are not kicked off the board—your sponsor slot moves down to the next rank. You retain full link and logo presence, and you can reclaim your top position at any time by simply paying the difference.',
    },
    {
      id: 'perks',
      icon: Globe,
      category: 'SEO & Perks',
      q: 'What permanent digital perks do sponsors receive?',
      summary: 'Direct do-follow backlink, real-time leaderboard rank, and perpetual campaign history.',
      detail:
        'Every backer gets an indexed, clickable link to their project on tinyspot.lol and our interactive live canvas. This provides immediate referral traffic from launch campaigns on X, Product Hunt, and Hacker News, along with high-quality search engine backlinks from an active domain.',
    },
    {
      id: 'payments',
      icon: ShieldCheck,
      category: 'Security & Billing',
      q: 'How does Dodo Payments handle security, taxes, and currencies?',
      summary: 'Global Merchant of Record handling UPI, Apple Pay, Google Pay, and Cards with instant activation.',
      detail:
        'Checkout is powered by Dodo Payments, an international Merchant of Record (MoR). Dodo manages global sales tax compliance, VAT, GST, and bank-grade fraud prevention. Sponsors can pay in USD or INR using credit/debit cards, Apple Pay, Google Pay, or Indian UPI. Once payment is confirmed, your spot is activated automatically at the edge.',
    },
    {
      id: 'assets',
      icon: Sparkles,
      category: 'Creative Assets',
      q: 'What logo formats are accepted and how does auto-fetch work?',
      summary: 'Enter your website URL for automatic high-res favicon retrieval, or upload custom PNG/SVG.',
      detail:
        'When you type your project domain, our client instantly fetches your website’s high-resolution favicon. You can also upload any custom PNG, WebP, or SVG logo. All assets are scaled and rendered using Retina-ready hardware ratios and authentic iOS squircle curvature.',
    },
    {
      id: 'support',
      icon: Mail,
      category: 'Direct Support',
      q: 'Can I change my destination URL, logo, or copy after purchasing?',
      summary: 'Yes. Direct founder support at connect@r69shabh.me or via DM to @r69shabh on X with under 12-hour turnaround.',
      detail:
        'You are not locked into your original submission. If you rebrand, launch a new feature, or need to change your URL or logo, simply email Rishabh at connect@r69shabh.me or message on X (@r69shabh) or GitHub (r69shabh). Your changes will be verified and deployed live to the edge.',
    },
  ];

  const handleToggle = (id) => {
    playClick();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq" className="mx-auto max-w-5xl px-4 sm:px-6 py-16 border-t border-hairline/70">
      {/* Section Header */}
      <div className="mb-10 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink border border-ink/10">
          Sponsor Knowledge Base
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Everything You Need to Know Before Bidding
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] sm:text-[15px] text-ink-2">
          Transparent details on physical phone impressions, auction outbid mathematics, Dodo Payments checkout, and post-launch sponsor perks.
        </p>
      </div>

      {/* 2-Column Bento Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition-all duration-200 ${
                isExpanded
                  ? 'border-ink bg-white shadow-md'
                  : 'border-hairline/80 bg-mist/30 hover:bg-mist/60 hover:border-ink-2/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-2">
                  <Icon className="h-3.5 w-3.5 text-ink" />
                  <span>{item.category}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className="rounded-full p-1 text-ink-2 hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label={isExpanded ? 'Collapse answer' : 'Expand answer'}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-ink' : ''
                    }`}
                  />
                </button>
              </div>

              <h3
                onClick={() => handleToggle(item.id)}
                className="text-[15px] font-semibold text-ink leading-snug cursor-pointer hover:text-blue-600 transition-colors"
              >
                {item.q}
              </h3>

              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
                {item.summary}
              </p>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-hairline/60 text-[13px] leading-relaxed text-ink-2 animate-in fade-in duration-200">
                  {item.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Questions Banner */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-orange-50/80 border border-orange-200/80 p-4 sm:p-5">
        <div className="text-center sm:text-left">
          <div className="text-[14px] font-bold text-orange-950">Have a custom question or partnership idea?</div>
          <div className="text-[12px] text-orange-800">Direct founder inbox · Responses typically in under 4 hours</div>
        </div>
        <a
          href="mailto:connect@r69shabh.me"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-orange-600 hover:bg-orange-700 px-5 py-2 text-xs font-bold text-white transition-colors shadow-xs"
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Email connect@r69shabh.me</span>
        </a>
      </div>
    </section>
  );
}

