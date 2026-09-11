import React, { useState } from 'react';
import { ExternalLink, Search, Trophy, Smartphone, Layers, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { playClick } from '../utils/audio';

export function Leaderboard({
  spots = [],
  currency = 'USD',
  onClaimSpot,
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'outside' | 'inside' | 'waitlist'

  const filteredSpots = spots
    .filter(spot => {
      if (filter === 'outside') return spot.rank <= 5;
      if (filter === 'inside') return spot.rank > 5 && spot.rank <= 20;
      if (filter === 'waitlist') return spot.rank > 20;
      return true;
    })
    .filter(spot => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        spot.brandName?.toLowerCase().includes(q) ||
        spot.tagline?.toLowerCase().includes(q) ||
        String(spot.rank).includes(q)
      );
    });

  return (
    <section id="leaderboard" className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">
            The Public Board
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink mt-1">
            Leaderboard & Ranks
          </h2>
          <p className="mt-1 text-[14px] text-ink-2">
            Top 5 on outside cover screen ($290–$780). Ranks 6–20 on inside canvas ($20–$160).
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-2/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands or ranks..."
            className="w-full rounded-full border border-hairline bg-mist/60 pl-9 pr-4 py-2 text-xs text-ink outline-none focus:border-ink focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 text-[12px] font-medium">
        {[
          { id: 'all', label: `All Ranked (${spots.length})` },
          { id: 'outside', label: `Outside Screen (Top 5 - Higher)`, icon: Smartphone },
          { id: 'inside', label: `Inside Screen (15 Apps - Lower)`, icon: Layers },
          { id: 'waitlist', label: `Waitlist / Line` },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { playClick(); setFilter(tab.id); }}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 border transition-all ${
                filter === tab.id
                  ? 'bg-ink text-white border-ink font-semibold shadow-xs'
                  : 'bg-white text-ink-2 border-hairline/80 hover:bg-mist'
              }`}
            >
              {Icon && <Icon className="h-3 w-3" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Table container */}
      <div className="overflow-hidden rounded-2xl border border-hairline/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-hairline bg-mist/60 text-[11px] font-semibold uppercase tracking-wider text-ink-2">
              <tr>
                <th className="px-5 py-3.5">Rank</th>
                <th className="px-5 py-3.5">Brand</th>
                <th className="hidden md:table-cell px-5 py-3.5">Placement</th>
                <th className="px-5 py-3.5 text-right">Total Bid ({currency})</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/60">
              {filteredSpots.map((spot) => {
                const isOutside = spot.rank <= 5;
                const isInside = spot.rank > 5 && spot.rank <= 20;

                return (
                  <tr
                    key={spot.id || spot.rank}
                    className="group hover:bg-mist/40 transition-colors"
                  >
                    {/* Rank Number */}
                    <td className="px-5 py-4 font-bold text-ink whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {spot.rank === 1 && (
                          <Trophy className="h-4 w-4 text-amber-500 fill-amber-500" />
                        )}
                        <span className={`tabular-nums ${spot.rank <= 3 ? 'text-ink font-extrabold' : 'text-ink-2'}`}>
                          #{spot.rank}
                        </span>
                      </div>
                    </td>

                    {/* Brand details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs"
                          style={{ backgroundColor: spot.logoBg || '#1d1d1f' }}
                        >
                          {spot.logoText || spot.brandName?.slice(0, 2) || '✦'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={spot.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-ink hover:underline flex items-center gap-1"
                            >
                              <span>{spot.brandName}</span>
                              <ExternalLink className="h-3 w-3 text-ink-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </div>
                          <p className="truncate text-[11px] text-ink-2 max-w-xs sm:max-w-md">
                            {spot.tagline}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Placement badge */}
                    <td className="hidden md:table-cell px-5 py-4 whitespace-nowrap">
                      {isOutside && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-800 border border-orange-200">
                          <Smartphone className="h-3 w-3 text-orange-600" />
                          Outside Cover Screen (Top Tier)
                        </span>
                      )}
                      {isInside && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 border border-indigo-200">
                          <Layers className="h-3 w-3" />
                          Inside Screen
                        </span>
                      )}
                      {!isOutside && !isInside && (
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 border border-zinc-200">
                          Waitlist (Next in Line)
                        </span>
                      )}
                    </td>

                    {/* Total Bid Amount */}
                    <td className="px-5 py-4 text-right font-semibold tabular-nums text-emerald-600 whitespace-nowrap">
                      {formatPrice(spot.bidAmount, currency)}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => { playClick(); onClaimSpot(spot); }}
                        className="rounded-full border border-hairline bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink hover:bg-ink hover:text-white transition-all shadow-2xs"
                      >
                        Outbid #{spot.rank}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
