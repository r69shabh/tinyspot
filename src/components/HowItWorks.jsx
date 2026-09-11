import React from 'react';
import { Smartphone, Layers, TrendingUp, ShieldCheck } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Pick your spot & set your bid',
      icon: ShieldCheck,
      desc: 'Claim any vacant spot starting from its base price, or outbid an existing sponsor by +$5 (₹500). Secure checkout powered by Dodo Payments with Cards, Apple Pay, Google Pay, and UPI.',
    },
    {
      num: '2',
      title: 'Top 5 on the cover display',
      icon: Smartphone,
      desc: 'Ranks #1–#5 command the high-frequency front screen ($290–$780). This is the display seen whenever the device is in hand or resting on a table. #1 earns the prominent hero billboard widget.',
    },
    {
      num: '3',
      title: '15 spots on the folding canvas',
      icon: Layers,
      desc: 'Ranks #6–#20 secure spots ($20–$160) across the 7.6-inch unfolded inner OLED screen. 8 spots live on the left panel and 7 spots live on the right panel.',
    },
    {
      num: '4',
      title: 'Real-time public leaderboard',
      icon: TrendingUp,
      desc: 'Your brand goes live on the phone render the second payment confirms. If someone outbids your spot, you naturally shift down by one rank. Clicking any logo directs traffic straight to your site.',
    },
  ];

  return (
    <section id="how" className="mx-auto max-w-5xl px-6 py-14 border-t border-hairline/70">
      <div className="mb-10 text-center">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">
          Transparent Auction Rules
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-ink mt-1">
          How it works
        </h2>
        <p className="mt-2 text-[15px] text-ink-2 max-w-xl mx-auto">
          Rent digital real estate on the first Apple iPhone Fold on <strong className="text-ink">tinyspot.lol</strong>.
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
