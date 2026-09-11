import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ActivityTicker } from './components/ActivityTicker';
import { PhoneShowcase } from './components/PhoneShowcase';
import { Leaderboard } from './components/Leaderboard';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { BidModal } from './components/BidModal';
import { createEmptyBoard, SPOT_BASE_PRICES } from './data/initialBoard';
import confetti from 'canvas-confetti';
import { playSuccessChime } from './utils/audio';

const STORAGE_KEY_CURRENCY = 'tinyspot_currency_v3';

export function App() {
  const [spots, setSpots] = useState(createEmptyBoard());
  const [activity, setActivity] = useState([]);
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_CURRENCY) || 'USD';
    } catch (e) {
      return 'USD';
    }
  });

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedSpotForClaim, setSelectedSpotForClaim] = useState(null);

  // Sync currency to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
    } catch (e) {}
  }, [currency]);

  // Load spots and activity from Cloudflare D1 database API
  const fetchD1State = async () => {
    try {
      const res = await fetch('/api/spots');
      if (res.ok) {
        const data = await res.json();
        const claimedSpots = data.spots || [];
        
        // Merge claimed spots from D1 with empty board template
        const baseBoard = createEmptyBoard();
        const mergedBoard = baseBoard.map(slot => {
          const claimed = claimedSpots.find(cs => cs.rank === slot.rank);
          if (claimed) {
            return {
              ...slot,
              brandName: claimed.brand_name,
              url: claimed.url,
              tagline: claimed.tagline,
              bidAmount: claimed.bid_amount_usd,
              logoBg: claimed.logo_bg,
              logoText: claimed.logo_text,
              logoUrl: claimed.logo_url,
              claimedAt: claimed.claimed_at,
            };
          }
          return slot;
        });

        setSpots(mergedBoard);
        setActivity(data.activity || []);
      }
    } catch (e) {
      console.warn('Could not fetch D1 spots:', e.message);
    }
  };

  useEffect(() => {
    fetchD1State();
  }, []);

  // Handle return redirect from Dodo Payments checkout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        const processReturn = async () => {
          let bidToConfirm = null;

          // 1. Try sessionStorage
          try {
            const pendingRaw = sessionStorage.getItem('tinyspot_pending_bid');
            if (pendingRaw) {
              bidToConfirm = JSON.parse(pendingRaw);
              sessionStorage.removeItem('tinyspot_pending_bid');
            }
          } catch (e) {}

          // 2. Fallback: try session_id lookup via API
          const sessionId = params.get('session_id') || params.get('sessionId');
          if (!bidToConfirm && sessionId) {
            try {
              const res = await fetch(`/api/checkout-status?session_id=${encodeURIComponent(sessionId)}`);
              if (res.ok) {
                const data = await res.json();
                if (data.session) {
                  bidToConfirm = {
                    rank: data.session.rank,
                    brandName: data.session.brand_name,
                    url: data.session.url,
                    tagline: data.session.tagline,
                    bidAmountUSD: data.session.bid_amount_usd,
                    logoBg: data.session.logo_bg,
                    logoText: data.session.logo_text,
                    logoUrl: data.session.logo_url,
                  };
                }
              }
            } catch (apiErr) {}
          }

          // 3. Fallback: URL params
          if (!bidToConfirm && params.get('rank')) {
            bidToConfirm = {
              rank: Number(params.get('rank')),
              brandName: decodeURIComponent(params.get('brand') || 'Verified Sponsor'),
              url: 'https://tinyspot.lol',
              tagline: 'Official launch sponsor',
              bidAmountUSD: 20,
            };
          }

          if (bidToConfirm) {
            await handleConfirmBid(bidToConfirm);
            playSuccessChime();
            confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        };

        processReturn();
      }
    }
  }, []);

  // Calculate total amount raised from claimed spots only
  const totalRaisedUSD = spots
    .filter(s => Boolean(s.brandName))
    .reduce((sum, s) => sum + (s.bidAmount || 0), 0);

  const claimedBiddersCount = spots.filter(s => Boolean(s.brandName)).length;

  const handleClaimSpot = (spot) => {
    setSelectedSpotForClaim(spot);
    setIsBidModalOpen(true);
  };

  const handleOpenGeneralBid = () => {
    setSelectedSpotForClaim(null);
    setIsBidModalOpen(true);
  };

  // Commit bid to D1 database
  const handleConfirmBid = async (bidData) => {
    const targetRank = Number(bidData.rank);
    const amountUSD = Number(bidData.bidAmount || bidData.bidAmountUSD);

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rank: targetRank,
          brandName: bidData.brandName,
          url: bidData.url,
          tagline: bidData.tagline,
          bidAmountUSD: amountUSD,
          logoBg: bidData.logoBg,
          logoText: bidData.logoText,
          logoUrl: bidData.logoUrl,
        }),
      });

      if (res.ok) {
        await fetchD1State();
        return;
      }
    } catch (e) {
      console.warn('D1 claim call failed, updating local state:', e.message);
    }

    // Local state fallback if offline
    setSpots(prevSpots => {
      return prevSpots.map(s => {
        if (s.rank === targetRank) {
          return {
            ...s,
            brandName: bidData.brandName,
            url: bidData.url,
            tagline: bidData.tagline,
            bidAmount: amountUSD,
            logoBg: bidData.logoBg,
            logoText: bidData.logoText,
            logoUrl: bidData.logoUrl,
            claimedAt: new Date().toISOString(),
          };
        }
        return s;
      });
    });

    setActivity(prev => [
      {
        id: `act_${Date.now()}`,
        type: 'claim',
        rank: targetRank,
        brand_name: bidData.brandName,
        amount_usd: amountUSD,
        created_at: new Date().toISOString(),
      },
      ...prev
    ]);
  };

  // Reset database back to pure 0 state
  const handleResetBoard = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {}
    setSpots(createEmptyBoard());
    setActivity([]);
  };

  return (
    <div className="min-h-screen bg-white text-ink selection:bg-black selection:text-white">
      {/* Header with Dollar/INR Price Progress */}
      <Header
        totalRaisedUSD={totalRaisedUSD}
        currency={currency}
        onToggleCurrency={setCurrency}
        biddersCount={claimedBiddersCount}
      />

      {/* Live Activity Ticker (only renders when there is activity) */}
      <ActivityTicker
        activity={activity}
        currency={currency}
      />

      {/* Main Interactive Phone Showcase with Real CAD Renders */}
      <PhoneShowcase
        spots={spots}
        currency={currency}
        onClaim={handleClaimSpot}
        onOpenBidModal={handleOpenGeneralBid}
      />

      {/* Leaderboard Table (Shows all 20 spots, vacant and claimed) */}
      <Leaderboard
        spots={spots}
        currency={currency}
        onClaimSpot={handleClaimSpot}
      />

      {/* How it Works Explainer */}
      <HowItWorks />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Footer */}
      <Footer
        biddersCount={claimedBiddersCount}
        onResetBoard={handleResetBoard}
      />

      {/* Dodo Payments Outbid & Claim Modal with Proper Form */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        initialSpot={selectedSpotForClaim}
        spots={spots}
        currency={currency}
        onConfirmBid={handleConfirmBid}
      />
    </div>
  );
}
export default App;
