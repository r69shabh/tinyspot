import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { playClick } from '../utils/audio';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Is tinyspot.lol real?',
      a: 'Yes. The board is real, the rankings are public, and Dodo Payments handles checkout. When you claim a spot, your brand goes live instantly on the interactive phone showcase and public leaderboard.',
    },
    {
      q: 'Why the iPhone Fold?',
      a: 'Apple’s first foldable smartphone is the biggest hardware conversation of the year. With a cover screen on the outside and a large unfolding canvas inside, it commands attention in meetings, coworking spaces, and in transit — turning into a unique physical and digital billboard.',
    },
    {
      q: 'How are spots and prices structured?',
      a: 'Our target is $3,600 USD (₹2,99,900 INR, the official India launch price). The high-glance Outside Screen holds the Top 5 spots ($290 to $780). The unfolding Inside Screen holds 15 spots ($20 to $160). You can claim any open spot at its starting base price, or outbid any sponsor by +$5 (+₹500).',
    },
    {
      q: 'How does Dodo Payments checkout work?',
      a: 'Dodo Payments serves as the Merchant of Record, providing secure global checkout. Sponsors can pay using Credit Cards, Apple Pay, Google Pay, or Indian UPI.',
    },
    {
      q: 'What happens if another sponsor outbids my rank?',
      a: 'When another sponsor outbids you by +$5 (+₹500), your spot gracefully moves down by one rank. You can reclaim your position at any time by bidding the difference.',
    },
    {
      q: 'What types of brands and projects can participate?',
      a: 'SaaS products, indie apps, developer tools, startups, newsletters, and creators are all welcome. We keep the showcase clean, respectful, and family-friendly.',
    },
    {
      q: 'How can I reach out for questions or support?',
      a: 'You can email Rishabh directly at connect@r69shabh.me for any questions, sponsorship verifications, or feedback.',
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
