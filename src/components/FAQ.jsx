import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { playClick } from '../utils/audio';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Is tinyspot.lol real?',
      a: 'The board is real, the ranking is public, and Dodo Payments processes checkout. You paste your website, customize your brand icon, and pay to take a rank. The top 20 sit directly on the iPhone Fold.',
    },
    {
      q: 'Why the iPhone Fold?',
      a: 'It is the most anticipated Apple hardware in a decade. With a 5.4-inch outer cover screen and a 7.6-inch unfolded inner canvas, it is a viral novelty. People stare at it in public, at coworking spaces, and in meetings — making it the most visible billboard possible.',
    },
    {
      q: 'How is the math divided between Outside and Inside screens?',
      a: 'The goal is $3,600 (₹2,99,900, the official India launch price of the 256GB iPhone Fold). The Outside Screen holds the premier Top 5 spots ($290 to $780) totaling $2,420 (~67% of the total goal) because the closed cover screen gets maximum daily visibility. The Inside Screen holds 15 spots ($20 to $160) totaling $1,180 (~33% of the goal) spread across the unfolded dual panels.',
    },
    {
      q: 'How does Dodo Payments work here?',
      a: 'Dodo Payments acts as the Merchant of Record (MoR), handling global tax compliance, fraud prevention, and payments via Credit Cards, Apple Pay, Google Pay, and UPI. All charges are in whole dollars with automatic rupee conversion.',
    },
    {
      q: 'What do I actually get as a sponsor?',
      a: 'A verified public rank on the leaderboard, a direct clickable link to your site, and — if you are in the top 20 — your logo sitting on the iPhone Fold home screens (Top 5 on outside cover screen, Ranks 6–20 on inside screen).',
    },
    {
      q: 'What if someone takes my spot?',
      a: 'They have to bid at least $5 (₹500) more than you. You simply slide down by one rank. Climbing back only costs the difference between what you previously paid and the new bid.',
    },
    {
      q: 'Can any brand or indie maker join?',
      a: 'Yes! SaaS tools, indie hackers, developer utilities, and creators are all welcome. We keep the board clean, family-friendly, and high quality.',
    }
  ];

  const handleToggle = (idx) => {
    playClick();
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-14 border-t border-hairline/70">
      <div className="mb-8">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">
          Everything You Need to Know
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-ink mt-1">
          Questions & Answers
        </h2>
        <p className="mt-2 text-[14px] text-ink-2">
          The rules of tinyspot.lol, Dodo Payments, and the price distribution math.
        </p>
      </div>

      <div className="divide-y divide-hairline/70 border-y border-hairline/70">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4">
              <button
                type="button"
                onClick={() => handleToggle(idx)}
                className="flex w-full items-center justify-between text-left text-[16px] font-semibold text-ink hover:text-black transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-ink-2 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2 pr-8 animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
