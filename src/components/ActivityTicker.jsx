import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/currency';

export function ActivityTicker({ activity = [], currency = 'INR' }) {
  if (!activity.length) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 my-2">
      <div className="flex items-center gap-3 overflow-hidden rounded-full border border-hairline/70 bg-mist/70 px-4 py-2 text-[12px] text-ink-2 shadow-xs">
        <div className="flex shrink-0 items-center gap-1 font-semibold text-emerald-600">
          <Flame className="h-3.5 w-3.5" />
          <span>Live Ticker:</span>
        </div>
        <div className="flex flex-1 items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          {activity.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-center gap-1.5 text-ink">
              <span className="font-semibold text-ink">{item.brandName}</span>
              {item.type === 'outbid' ? (
                <>
                  <span className="text-ink-2">took #{item.rank} from</span>
                  <span className="font-medium text-ink-2">{item.previousBrandName}</span>
                </>
              ) : (
                <span className="text-ink-2">claimed #{item.rank}</span>
              )}
              <span className="text-ink-2">for</span>
              <span className="font-semibold text-emerald-600">{formatPrice(item.amount, currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
