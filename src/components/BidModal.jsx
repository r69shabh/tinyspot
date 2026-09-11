import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldCheck, Sparkles, Smartphone, Layers, CheckCircle2, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice, usdToInr } from '../utils/currency';
import { playClick, playSuccessChime } from '../utils/audio';

export function BidModal({
  isOpen,
  onClose,
  initialSpot = null,
  spots = [],
  currency = 'USD',
  onConfirmBid,
}) {
  const [selectedRank, setSelectedRank] = useState(1);
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoBg, setLogoBg] = useState('#1d1d1f');
  const [logoText, setLogoText] = useState('✦');
  const [bidAmountUSD, setBidAmountUSD] = useState(25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Initialize modal state when opened
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsProcessing(false);
      setCheckoutUrl('');
      setStatusMessage('');
      const targetRank = initialSpot?.rank || 5;
      setSelectedRank(targetRank);
      
      const targetSpot = spots.find(s => s.rank === targetRank);
      const currentPrice = targetSpot?.bidAmount || 20;
      const minRequired = currentPrice + 5;
      setBidAmountUSD(minRequired);

      if (!url) {
        setUrl('https://mybrand.io');
        setBrandName('MyBrand');
        setTagline('Building the future of software');
      }
    }
  }, [isOpen, initialSpot, spots]);

  // Current spot info & minimum required bid ($5 above current)
  const currentSpot = spots.find(s => s.rank === selectedRank);
  const currentPrice = currentSpot?.bidAmount || 0;
  const minRequiredBidUSD = currentPrice > 0 ? currentPrice + 5 : 20;

  // Auto-detect brand name and logo text from URL
  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    try {
      let domain = newUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      if (domain) {
        const name = domain.split('.')[0];
        if (name && (!brandName || brandName === 'MyBrand')) {
          const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
          setBrandName(capitalized);
          setLogoText(capitalized.slice(0, 2));
        }
      }
    } catch (e) {}
  };

  const handleRankChange = (rank) => {
    playClick();
    setSelectedRank(rank);
    const spot = spots.find(s => s.rank === rank);
    const price = spot?.bidAmount || 0;
    setBidAmountUSD(price > 0 ? price + 5 : 20);
  };

  const handleAddAmount = (extraUSD) => {
    playClick();
    setBidAmountUSD(prev => Math.max(minRequiredBidUSD, prev + extraUSD));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bidAmountUSD < minRequiredBidUSD) return;

    playClick();
    setIsProcessing(true);
    setStatusMessage('Creating Dodo Payments checkout session...');

    try {
      // Call Vercel Serverless Function to connect Dodo Payments
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rank: selectedRank,
          brandName: brandName.trim() || 'MyBrand',
          url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
          tagline: tagline.trim() || 'Official sponsor on iPhone Fold',
          bidAmountUSD: Number(bidAmountUSD),
          returnUrl: `${window.location.origin}?success=true&rank=${selectedRank}`,
        }),
      });

      const data = await response.json().catch(() => ({}));

      // If Dodo Payments live/test checkout URL is returned
      if (data.checkout_url) {
        setCheckoutUrl(data.checkout_url);
        window.location.href = data.checkout_url;
        return;
      }

      // Demo or test verification
      setIsProcessing(false);
      setIsSuccess(true);
      playSuccessChime();

      // Confetti burst
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#1f8a4c', '#0071e3', '#1d1d1f']
      });

      // Commit bid to board
      onConfirmBid({
        rank: selectedRank,
        brandName: brandName.trim() || 'MyBrand',
        url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
        tagline: tagline.trim() || 'Official sponsor on iPhone Fold',
        bidAmount: Number(bidAmountUSD),
        logoBg,
        logoText: logoText.trim() || brandName.slice(0, 2) || '★',
        previousBrandName: currentSpot?.brandName,
      });

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback: still process local verification
      setIsProcessing(false);
      setIsSuccess(true);
      playSuccessChime();

      onConfirmBid({
        rank: selectedRank,
        brandName: brandName.trim() || 'MyBrand',
        url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
        tagline: tagline.trim() || 'Official sponsor on iPhone Fold',
        bidAmount: Number(bidAmountUSD),
        logoBg,
        logoText: logoText.trim() || brandName.slice(0, 2) || '★',
        previousBrandName: currentSpot?.brandName,
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-hairline/80 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => { playClick(); onClose(); }}
          className="absolute right-5 top-5 rounded-full p-1.5 text-ink-2 hover:bg-mist hover:text-ink transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-ink">You are on the Fold!</h3>
            <p className="mt-2 text-[15px] text-ink-2">
              <span className="font-semibold text-ink">{brandName}</span> claimed Rank #{selectedRank} for {formatPrice(bidAmountUSD, currency)}.
            </p>
            <p className="mt-1 text-[13px] text-ink-2">
              {selectedRank <= 5 ? 'Placed on the Outside Cover Screen.' : 'Placed on the Inside Unfolded Screen.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-semibold text-orange-800 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-orange-600" />
                  Dodo Payments Checkout
                </span>
                <span className="text-[12px] text-ink-2 font-medium">Whole $ amounts</span>
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Claim your spot on tinyspot.lol
              </h3>
              <p className="mt-1 text-[13px] text-ink-2">
                Top 5 on outside cover screen ($290–$780). Ranks 6–20 on inside screen ($20–$160).
              </p>
            </div>

            {/* Step 1: Pick Rank */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-ink-2 mb-2">
                Select Target Rank
              </label>
              <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto p-1 bg-mist/60 rounded-xl border border-hairline/50">
                {Array.from({ length: 20 }, (_, i) => {
                  const rank = i + 1;
                  const spot = spots.find(s => s.rank === rank);
                  const isCover = rank <= 5;
                  const isSelected = selectedRank === rank;

                  return (
                    <button
                      key={rank}
                      type="button"
                      onClick={() => handleRankChange(rank)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-all ${
                        isSelected
                          ? 'bg-ink text-white font-bold shadow-sm ring-2 ring-ink/30'
                          : isCover
                          ? 'bg-orange-50 text-orange-950 border border-orange-200/80 hover:bg-orange-100'
                          : 'bg-white text-ink border border-hairline/60 hover:bg-mist'
                      }`}
                    >
                      <span className="text-[10px] opacity-75">#{rank}</span>
                      <span className="font-semibold text-[11px] truncate max-w-[50px]">
                        {spot ? formatPrice(spot.bidAmount, currency) : 'Vacant'}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-2 px-1">
                <span className="flex items-center gap-1 text-orange-800 font-medium">
                  <Smartphone className="h-3 w-3" /> #1–#5: Outside Screen (Higher)
                </span>
                <span className="flex items-center gap-1 text-indigo-800 font-medium">
                  <Layers className="h-3 w-3" /> #6–#20: Inside Screen (Lower)
                </span>
              </div>
            </div>

            {/* Current Rank Status Info */}
            <div className="rounded-xl border border-hairline/70 bg-mist/50 p-3 text-[12px]">
              <div className="flex items-center justify-between font-medium">
                <span className="text-ink">
                  Currently at #{selectedRank}: <strong className="font-semibold">{currentSpot?.brandName || 'Vacant Spot'}</strong>
                </span>
                <span className="text-ink-2 font-semibold">
                  {currentSpot ? formatPrice(currentSpot.bidAmount, currency) : '$0'}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-ink-2">
                Minimum bid to take #{selectedRank} is <strong className="text-emerald-700 font-bold">{formatPrice(minRequiredBidUSD, currency)}</strong> (+$5 / +₹500 above current).
              </p>
            </div>

            {/* Step 2: Brand Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-ink-2 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://yourbrand.com"
                  required
                  className="w-full rounded-xl border border-hairline bg-mist/30 px-3 py-2 text-[13px] text-ink outline-none focus:border-ink focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase text-ink-2 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Linear"
                  required
                  className="w-full rounded-xl border border-hairline bg-mist/30 px-3 py-2 text-[13px] text-ink outline-none focus:border-ink focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-ink-2 mb-1">
                One-line Tagline / Pitch
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="The modern issue tracking tool for engineers"
                required
                maxLength={70}
                className="w-full rounded-xl border border-hairline bg-mist/30 px-3 py-2 text-[13px] text-ink outline-none focus:border-ink focus:bg-white transition-all"
              />
            </div>

            {/* Custom Icon & Color preview */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm border border-black/10"
                style={{ backgroundColor: logoBg }}
              >
                {logoText || brandName.slice(0, 2) || '★'}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value.slice(0, 3))}
                  placeholder="Icon (1-3 char / emoji)"
                  className="rounded-lg border border-hairline px-2.5 py-1.5 text-xs outline-none"
                />
                <div className="flex items-center gap-1.5">
                  {['#1d1d1f', '#f97316', '#0071e3', '#1f8a4c', '#7c1cff', '#ff6c37'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setLogoBg(c)}
                      className={`h-5 w-5 rounded-full border border-black/20 ${logoBg === c ? 'ring-2 ring-ink ring-offset-1' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Bid Amount & Presets */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold uppercase text-ink-2">
                  Your Bid Amount ({currency})
                </label>
                <span className="text-[11px] text-ink-2">
                  Min: {formatPrice(minRequiredBidUSD, currency)} ({currency === 'USD' ? `≈ ₹${usdToInr(minRequiredBidUSD).toLocaleString()}` : `$${minRequiredBidUSD}`})
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-ink">
                  {currency === 'USD' ? '$' : '₹'}
                </span>
                <input
                  type="number"
                  min={minRequiredBidUSD}
                  step={5}
                  value={currency === 'USD' ? bidAmountUSD : usdToInr(bidAmountUSD)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBidAmountUSD(currency === 'USD' ? val : Math.round(val / 83.3));
                  }}
                  className="w-full rounded-xl border border-hairline bg-white pl-8 pr-4 py-2.5 text-lg font-bold text-ink outline-none focus:border-ink"
                />
              </div>

              {/* Quick bump buttons */}
              <div className="mt-2 flex gap-1.5">
                {[5, 15, 50, 100].map(bump => (
                  <button
                    key={bump}
                    type="button"
                    onClick={() => handleAddAmount(bump)}
                    className="flex-1 rounded-lg border border-hairline bg-mist/60 py-1 text-[11px] font-semibold text-ink hover:bg-mist hover:border-ink-2/40 transition-colors"
                  >
                    +${bump} {currency === 'INR' && `(₹${Math.round(bump * 83.3)})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Dodo Payments MoR Info */}
            <div className="flex items-center justify-between rounded-xl bg-orange-50/70 p-3 border border-orange-200/80 text-[11px] text-orange-900">
              <div className="flex items-center gap-2">
                <span className="text-base">🦤</span>
                <div>
                  <div className="font-bold">Powered by Dodo Payments</div>
                  <div className="text-[10px] text-orange-800">Global MoR · Cards, UPI, Apple Pay, Google Pay</div>
                </div>
              </div>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold border border-orange-300">
                Live & Test
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={bidAmountUSD < minRequiredBidUSD || isProcessing}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 text-[15px] font-semibold text-white shadow-lg transition-all duration-200 hover:bg-orange-700 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? (
                <span>{statusMessage || 'Processing checkout...'}</span>
              ) : (
                <>
                  <span>Pay {formatPrice(bidAmountUSD, currency)} with Dodo Payments</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
