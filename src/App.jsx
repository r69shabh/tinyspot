import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ActivityTicker } from './components/ActivityTicker';
import { PhoneShowcase } from './components/PhoneShowcase';
import { Leaderboard } from './components/Leaderboard';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { BidModal } from './components/BidModal';
import { INITIAL_SPONSORS, INITIAL_ACTIVITY } from './data/initialBoard';
import confetti from 'canvas-confetti';
import { playSuccessChime } from './utils/audio';

const STORAGE_KEY_SPOTS = 'tinyspot_sponsors_v2';
const STORAGE_KEY_ACTIVITY = 'tinyspot_activity_v2';
const STORAGE_KEY_CURRENCY = 'tinyspot_currency_v2';

export function App() {
  const [spots, setSpots] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPOTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SPONSORS;
  });

  const [activity, setActivity] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ACTIVITY;
  });

  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENCY);
      if (saved) return saved;
    } catch (e) {}
    return 'USD';
  });

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedSpotForClaim, setSelectedSpotForClaim] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SPOTS, JSON.stringify(spots));
    } catch (e) {}
  }, [spots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(activity));
    } catch (e) {}
  }, [activity]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
    } catch (e) {}
  }, [currency]);

  // Handle return redirect from Dodo Payments checkout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        try {
          const pendingRaw = sessionStorage.getItem('tinyspot_pending_bid');
          if (pendingRaw) {
            const pending = JSON.parse(pendingRaw);
            sessionStorage.removeItem('tinyspot_pending_bid');
            handleConfirmBid(pending);
            playSuccessChime();
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
          }
        } catch (e) {}
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Calculate total amount raised in USD
  const totalRaisedUSD = spots.reduce((sum, s) => sum + (s.bidAmount || 0), 0);

  // Open modal for a specific spot or general CTA
  const handleClaimSpot = (spot) => {
    setSelectedSpotForClaim(spot);
    setIsBidModalOpen(true);
  };

  const handleOpenGeneralBid = () => {
    setSelectedSpotForClaim(null);
    setIsBidModalOpen(true);
  };

  // Process a new bid or outbid
  const handleConfirmBid = (bidData) => {
    const targetRank = bidData.rank;

    // Create the new sponsor entry
    const newSponsor = {
      id: `spot-${Date.now()}`,
      rank: targetRank,
      screen: targetRank <= 5 ? 'outside' : (targetRank <= 13 ? 'inside-left' : (targetRank <= 20 ? 'inside-right' : 'waitlist')),
      brandName: bidData.brandName,
      url: bidData.url,
      tagline: bidData.tagline,
      bidAmount: Number(bidData.bidAmount),
      logoBg: bidData.logoBg,
      logoText: bidData.logoText,
      claimedAt: Date.now(),
    };

    // Shift all existing sponsors at targetRank and below down by 1
    const updatedSpots = [];
    let placed = false;

    const currentSorted = [...spots].sort((a, b) => a.rank - b.rank);

    for (const s of currentSorted) {
      if (s.rank < targetRank) {
        updatedSpots.push(s);
      } else {
        if (!placed) {
          updatedSpots.push(newSponsor);
          placed = true;
        }
        const newRank = s.rank + 1;
        updatedSpots.push({
          ...s,
          rank: newRank,
          screen: newRank <= 5 ? 'outside' : (newRank <= 13 ? 'inside-left' : (newRank <= 20 ? 'inside-right' : 'waitlist')),
        });
      }
    }

    if (!placed) {
      updatedSpots.push(newSponsor);
    }

    setSpots(updatedSpots);

    // Add entry to activity
    const newActivityItem = {
      id: `act-${Date.now()}`,
      type: bidData.previousBrandName ? 'outbid' : 'claim',
      brandName: bidData.brandName,
      previousBrandName: bidData.previousBrandName,
      rank: targetRank,
      amount: bidData.bidAmount,
      timestamp: Date.now(),
    };
    setActivity(prev => [newActivityItem, ...prev.slice(0, 19)]);
  };

  // Reset to default sample data
  const handleResetBoard = () => {
    localStorage.removeItem(STORAGE_KEY_SPOTS);
    localStorage.removeItem(STORAGE_KEY_ACTIVITY);
    setSpots(INITIAL_SPONSORS);
    setActivity(INITIAL_ACTIVITY);
  };

  return (
    <div className="min-h-screen bg-white text-ink selection:bg-black selection:text-white">
      {/* Header with Dollar/INR Price Progress */}
      <Header
        totalRaisedUSD={totalRaisedUSD}
        currency={currency}
        onToggleCurrency={setCurrency}
        biddersCount={spots.length}
      />

      {/* Live Activity Ticker */}
      <ActivityTicker
        activity={activity}
        currency={currency}
      />

      {/* Main Interactive Phone Showcase with Outside & Inside Screens */}
      <PhoneShowcase
        spots={spots}
        currency={currency}
        onClaim={handleClaimSpot}
        onOpenBidModal={handleOpenGeneralBid}
      />

      {/* Leaderboard Table */}
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
        biddersCount={spots.length}
        onResetBoard={handleResetBoard}
      />

      {/* Dodo Payments Outbid & Claim Modal */}
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
