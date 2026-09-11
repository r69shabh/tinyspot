import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ShieldCheck, Smartphone, Layers, CheckCircle2, Upload, Sparkles } from 'lucide-react';
import { formatPrice, usdToInr } from '../utils/currency';
import { playClick } from '../utils/audio';
import { SPOT_BASE_PRICES } from '../data/initialBoard';

const DODO_API_KEY = '0sBurbjtawrdLcLg.Q9oitL5QLFBaz4AnTfcZnccjANGl6Cj0iCGIG-T2wLUTA6vF';
const DODO_PRODUCT_ID = 'pdt_0Nm5UYjiECVXnZNzh0a2X';

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
  const [logoUrl, setLogoUrl] = useState('');
  const [bidAmountUSD, setBidAmountUSD] = useState(780);
  const [inputCurrency, setInputCurrency] = useState(currency || 'USD');
  const [screenTab, setScreenTab] = useState('outside'); // 'outside' | 'inside'
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  // Initialize modal state when opened
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setStatusMessage('');
      setErrorMsg('');
      setInputCurrency(currency || 'USD');

      const targetRank = initialSpot?.rank || 1;
      setSelectedRank(targetRank);
      setScreenTab(targetRank <= 5 ? 'outside' : 'inside');
      
      const currentSpot = spots.find(s => s.rank === targetRank);
      const isOccupied = currentSpot && currentSpot.brandName;
      const basePrice = SPOT_BASE_PRICES[targetRank] || 20;
      const minRequired = isOccupied ? (currentSpot.bidAmount + 5) : basePrice;
      setBidAmountUSD(minRequired);

      if (!url) {
        setUrl('');
        setBrandName('');
        setTagline('');
        setLogoUrl('');
      }
    }
  }, [isOpen, initialSpot, spots]);

  const currentSpot = spots.find(s => s.rank === selectedRank);
  const isOccupied = currentSpot && currentSpot.brandName;
  const basePrice = SPOT_BASE_PRICES[selectedRank] || 20;
  const minRequiredBidUSD = isOccupied ? (currentSpot.bidAmount + 5) : basePrice;

  // Auto-detect brand name & favicon from URL
  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    setErrorMsg('');
    try {
      let domain = newUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      if (domain && domain.includes('.')) {
        const name = domain.split('.')[0];
        if (name && (!brandName || brandName === 'MyBrand')) {
          const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
          setBrandName(capitalized);
          setLogoText(capitalized.slice(0, 2));
        }
        // Auto favicon
        const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        setLogoUrl(favicon);
      }
    } catch (e) {}
  };

  const handleRankSelect = (rank) => {
    playClick();
    setSelectedRank(rank);
    setScreenTab(rank <= 5 ? 'outside' : 'inside');
    const spot = spots.find(s => s.rank === rank);
    const occupied = spot && spot.brandName;
    const base = SPOT_BASE_PRICES[rank] || 20;
    const min = occupied ? (spot.bidAmount + 5) : base;
    setBidAmountUSD(min);
  };

  const handleAddAmount = (extraUSD) => {
    playClick();
    setBidAmountUSD(prev => Math.max(minRequiredBidUSD, prev + extraUSD));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Image size should be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) {
      setErrorMsg('Please enter a brand name');
      return;
    }
    if (!url.trim()) {
      setErrorMsg('Please enter a website URL');
      return;
    }
    if (bidAmountUSD < minRequiredBidUSD) {
      setErrorMsg(`Minimum bid for Rank #${selectedRank} is $${minRequiredBidUSD}`);
      return;
    }

    playClick();
    setIsProcessing(true);
    setErrorMsg('');
    setStatusMessage('Creating Dodo Payments checkout session...');

    const cleanBidData = {
      rank: selectedRank,
      brandName: brandName.trim(),
      url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
      tagline: tagline.trim() || 'Official sponsor on iPhone Fold',
      bidAmountUSD: Number(bidAmountUSD),
      logoBg,
      logoText: logoText.trim() || brandName.slice(0, 2) || '★',
      logoUrl,
    };

    // Save pending bid to sessionStorage
    try {
      sessionStorage.setItem('tinyspot_pending_bid', JSON.stringify({
        ...cleanBidData,
        bidAmount: Number(bidAmountUSD),
      }));
    } catch (err) {}

    try {
      // 1. Try backend Cloudflare Pages Function /api/checkout
      let checkoutUrl = null;
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...cleanBidData,
            returnUrl: `${window.location.origin}/?success=true&rank=${selectedRank}`,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.checkout_url) checkoutUrl = data.checkout_url;
        }
      } catch (apiErr) {}

      // 2. Direct client-side Dodo Payments API call
      if (!checkoutUrl) {
        const directRes = await fetch('https://test.dodopayments.com/checkouts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DODO_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_cart: [
              {
                product_id: DODO_PRODUCT_ID,
                quantity: Math.max(1, Math.round(Number(bidAmountUSD))),
              },
            ],
            return_url: `${window.location.origin}/?success=true&rank=${selectedRank}`,
            metadata: {
              rank: String(selectedRank),
              brandName: cleanBidData.brandName,
              url: cleanBidData.url,
            },
          }),
        });

        if (directRes.ok) {
          const directData = await directRes.json();
          if (directData.checkout_url) checkoutUrl = directData.checkout_url;
        }
      }

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      // Fallback: claim in local database
      await onConfirmBid({
        ...cleanBidData,
        bidAmount: Number(bidAmountUSD),
      });
      setIsProcessing(false);
      onClose();

    } catch (err) {
      console.error('Checkout error:', err);
      await onConfirmBid({
        ...cleanBidData,
        bidAmount: Number(bidAmountUSD),
      });
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto overflow-hidden rounded-3xl border border-hairline/80 bg-white p-5 sm:p-7 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => { playClick(); onClose(); }}
          className="absolute right-4 top-4 rounded-full p-2 text-ink-2 hover:bg-mist hover:text-ink transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-semibold text-orange-800 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-orange-600" />
              Dodo Payments Verified
            </span>
            <span className="text-[11px] font-medium text-ink-2">
              {selectedRank <= 5 ? 'Outside Cover Display' : 'Inside Unfolded Canvas'}
            </span>
          </div>
          <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Claim Rank #{selectedRank} on tinyspot.lol
          </h3>
          <p className="mt-1 text-[13px] text-ink-2">
            Put your brand on the first Apple iPhone Fold. Your spot goes live immediately upon checkout.
          </p>
        </div>

        {errorMsg && (
          <div className="mt-3 rounded-xl bg-red-50 p-2.5 text-[12px] font-medium text-red-700 border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Rank & Screen Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-2">
                Choose Screen & Rank
              </label>
              <div className="flex rounded-full bg-mist p-0.5 text-[11px] font-medium border border-hairline/60">
                <button
                  type="button"
                  onClick={() => { playClick(); setScreenTab('outside'); }}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 transition-all ${
                    screenTab === 'outside' ? 'bg-white font-bold text-ink shadow-xs' : 'text-ink-2'
                  }`}
                >
                  <Smartphone className="h-3 w-3 text-orange-600" /> Outside (1–5)
                </button>
                <button
                  type="button"
                  onClick={() => { playClick(); setScreenTab('inside'); }}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 transition-all ${
                    screenTab === 'inside' ? 'bg-white font-bold text-ink shadow-xs' : 'text-ink-2'
                  }`}
                >
                  <Layers className="h-3 w-3 text-indigo-600" /> Inside (6–20)
                </button>
              </div>
            </div>

            {/* Rank Grid */}
            <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-mist/60 rounded-xl border border-hairline/50">
              {(screenTab === 'outside'
                ? [1, 2, 3, 4, 5]
                : [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
              ).map((rank) => {
                const spot = spots.find(s => s.rank === rank);
                const occupied = spot && spot.brandName;
                const price = spot?.bidAmount || SPOT_BASE_PRICES[rank] || 20;
                const isSelected = selectedRank === rank;

                return (
                  <button
                    key={rank}
                    type="button"
                    onClick={() => handleRankSelect(rank)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs transition-all ${
                      isSelected
                        ? 'bg-ink text-white font-bold ring-2 ring-ink/40 shadow-sm'
                        : occupied
                        ? 'bg-orange-50 text-orange-950 border border-orange-200 hover:bg-orange-100'
                        : 'bg-white text-ink border border-hairline/60 hover:bg-mist'
                    }`}
                  >
                    <span className="text-[10px] opacity-75">#{rank}</span>
                    <span className="font-semibold text-[11px] truncate max-w-[55px]">
                      {occupied ? spot.brandName : `$${price}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Price helper */}
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-2 px-1">
              <span>
                {isOccupied ? (
                  <>Currently held by <strong>{currentSpot.brandName}</strong> (${currentSpot.bidAmount})</>
                ) : (
                  <>Currently <strong>Vacant</strong> (Starting at ${basePrice})</>
                )}
              </span>
              <span className="font-semibold text-emerald-700">
                Min Bid: ${minRequiredBidUSD} (≈ ₹{usdToInr(minRequiredBidUSD).toLocaleString()})
              </span>
            </div>
          </div>

          {/* Proper Form Fields: Brand Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-ink-2 mb-1">
                Website URL *
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://yourcompany.com"
                required
                className="w-full rounded-xl border border-hairline bg-mist/30 px-3 py-2 text-[13px] text-ink outline-none focus:border-ink focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-ink-2 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => { setBrandName(e.target.value); setErrorMsg(''); }}
                placeholder="e.g. Acme Studio"
                required
                className="w-full rounded-xl border border-hairline bg-mist/30 px-3 py-2 text-[13px] text-ink outline-none focus:border-ink focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase text-ink-2">
                One-Line Pitch / Tagline
              </label>
              <span className="text-[10px] text-ink-2">{tagline.length}/70</span>
            </div>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Next generation AI tooling for developers"
              maxLength={70}
              className="w-full rounded-xl border border-hairline bg-mist/30 px-3 py-2 text-[13px] text-ink outline-none focus:border-ink focus:bg-white transition-all"
            />
          </div>

          {/* Logo & Visual Icon Picker */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-ink-2 mb-1">
              Logo & Visual Appearance
            </label>
            <div className="flex items-center gap-3">
              {/* Preview Box */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm border border-black/10"
                style={{ backgroundColor: logoBg }}
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
                ) : (
                  <span className="text-base font-bold text-white">{logoText || '★'}</span>
                )}
              </div>

              {/* Logo Controls */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={logoText}
                    onChange={(e) => { setLogoText(e.target.value.slice(0, 3)); setLogoUrl(''); }}
                    placeholder="Initials / Emoji"
                    className="w-28 rounded-lg border border-hairline px-2 py-1 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 rounded-lg border border-hairline bg-mist/60 px-2.5 py-1 text-xs font-medium text-ink hover:bg-mist transition-colors"
                  >
                    <Upload className="h-3 w-3" /> Upload Logo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5">
                  {['#1d1d1f', '#f97316', '#0071e3', '#1f8a4c', '#7c1cff', '#ef4444', '#0f172a'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setLogoBg(c)}
                      className={`h-5 w-5 rounded-full border border-black/15 ${logoBg === c ? 'ring-2 ring-ink ring-offset-1' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bid Amount Box */}
          <div className="rounded-2xl border border-hairline/80 bg-mist/20 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-2">
                Bid Amount
              </label>
              {/* Currency Selector Pill */}
              <div className="flex items-center rounded-full bg-mist p-0.5 text-[11px] font-medium border border-hairline/60">
                <button
                  type="button"
                  onClick={() => { playClick(); setInputCurrency('USD'); }}
                  className={`rounded-full px-2 py-0.5 transition-all ${
                    inputCurrency === 'USD' ? 'bg-white text-ink font-bold shadow-xs' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  $ USD
                </button>
                <button
                  type="button"
                  onClick={() => { playClick(); setInputCurrency('INR'); }}
                  className={`rounded-full px-2 py-0.5 transition-all ${
                    inputCurrency === 'INR' ? 'bg-white text-ink font-bold shadow-xs' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  ₹ INR
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-ink">
                {inputCurrency === 'INR' ? '₹' : '$'}
              </span>
              <input
                type="number"
                min={inputCurrency === 'INR' ? usdToInr(minRequiredBidUSD) : minRequiredBidUSD}
                step={inputCurrency === 'INR' ? 500 : 5}
                value={inputCurrency === 'INR' ? usdToInr(bidAmountUSD) : bidAmountUSD}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (inputCurrency === 'INR') {
                    setBidAmountUSD(Math.max(minRequiredBidUSD, inrToUsd(val)));
                  } else {
                    setBidAmountUSD(Math.max(1, val));
                  }
                }}
                className="w-full rounded-xl border border-hairline bg-white pl-8 pr-32 py-2.5 text-lg font-bold text-ink outline-none focus:border-ink transition-all shadow-xs"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-2">
                {inputCurrency === 'INR'
                  ? `≈ $${bidAmountUSD.toLocaleString()} USD`
                  : `≈ ₹${usdToInr(bidAmountUSD).toLocaleString()} INR`
                }
              </span>
            </div>

            {/* Quick Presets */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-ink-2 mr-1">Add:</span>
              {(inputCurrency === 'INR'
                ? [500, 2000, 5000, 10000]
                : [5, 25, 50, 100]
              ).map(bump => (
                <button
                  key={bump}
                  type="button"
                  onClick={() => {
                    playClick();
                    if (inputCurrency === 'INR') {
                      setBidAmountUSD(prev => prev + inrToUsd(bump));
                    } else {
                      handleAddAmount(bump);
                    }
                  }}
                  className="flex-1 rounded-lg border border-hairline bg-white py-1 text-[11px] font-semibold text-ink hover:bg-mist hover:border-ink-2/40 transition-colors shadow-xs"
                >
                  +{inputCurrency === 'INR' ? `₹${bump.toLocaleString()}` : `$${bump}`}
                </button>
              ))}
            </div>

            <div className="mt-2 text-[10px] text-ink-2 flex justify-between items-center">
              <span>Minimum required: <strong>${minRequiredBidUSD} USD</strong> (₹{usdToInr(minRequiredBidUSD).toLocaleString()} INR)</span>
              <span className="text-emerald-700 font-medium">Outbid step: +$5 / +₹500</span>
            </div>
          </div>

          {/* Dodo Payments Info Banner */}
          <div className="flex items-center justify-between rounded-xl bg-orange-50/80 p-3 border border-orange-200 text-[11px] text-orange-950">
            <div className="flex items-center gap-2">
              <span className="text-lg">🦤</span>
              <div>
                <div className="font-bold">Checkout with Dodo Payments</div>
                <div className="text-[10px] text-orange-800">Global MoR · Cards, Apple Pay, Google Pay, UPI</div>
              </div>
            </div>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-orange-800 border border-orange-300">
              Instant Activation
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isProcessing || bidAmountUSD < minRequiredBidUSD}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 text-[15px] font-bold text-white shadow-lg transition-all duration-200 hover:bg-orange-700 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <span>{statusMessage || 'Connecting to Dodo Payments...'}</span>
            ) : (
              <>
                <span>Pay ${bidAmountUSD} USD (≈ ₹{usdToInr(bidAmountUSD).toLocaleString()}) · Claim Spot #{selectedRank}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
