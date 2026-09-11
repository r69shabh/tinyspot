import React from 'react';
import { Smartphone, Layers, TrendingUp, ShieldCheck } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Pay to rank on Dodo',
      icon: ShieldCheck,
      desc: 'Pay any whole-dollar amount through Dodo Payments (Cards, Apple Pay, Google Pay, UPI). Higher total ranks higher. Each rank must be at least $5 (₹500) above the next. If you bid again, you only pay the difference.',
    },
    {
      num: '2',
      title: 'Top five on outside screen',
      icon: Smartphone,
      desc: 'Ranks #1–#5 hold the high-value premier spots ($290–$780) on the closed cover screen. This is the display everyone stares at when the phone is in hand or resting on a table. #1 holds the billboard widget card.',
    },
    {
      num: '3',
      title: '15 spots on inside screen',
      icon: Layers,
      desc: 'Ranks #6–#20 hold the accessible spots ($20–$160) across the 7.6-inch unfolded inner canvas. 8 app icons on the left panel and 7 app icons on the right panel. Your spot shifts the second payment confirms.',
    },
    {
      num: '4',
      title: 'Everyone is ranked',
      icon: TrendingUp,
      desc: 'The list is every bidder, from #1 down. Beat #20 by $5 to break onto the phone. Beat #5 to break onto the cover display. Clicking any logo directs traffic straight to your website.',
    },
  ];

  return (
    <section id="how" className="mx-auto max-w-5xl px-6 py-14 border-t border-hairline/70">
      <div className="mb-10 text-center">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">
          Simple Outbid Rules
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-ink mt-1">
          How it works
        </h2>
        <p className="mt-2 text-[15px] text-ink-2 max-w-xl mx-auto">
          Rent the dual screens of the first Apple iPhone Fold on <strong className="text-ink">tinyspot.lol</strong>. Payments handled by Dodo Payments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative flex flex-col justify-between rounded-3xl border border-hairline/80 bg-mist/40 p-6 transition-all hover:bg-mist/80"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                    {step.num}
                  </span>
                  <Icon className="h-5 w-5 text-ink-2" />
                </div>
                <h3 className="text-[16px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
