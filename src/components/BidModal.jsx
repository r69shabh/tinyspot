import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ShieldCheck, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { formatPrice, usdToInr, inrToUsd } from '../utils/currency';
import { playClick } from '../utils/audio';
import { SPOT_BASE_PRICES } from '../data/initialBoard';

const DODO_API_KEY = '0sBurbjtawrdLcLg.Q9oitL5QLFBaz4AnTfcZnccjANGl6Cj0iCGIG-T2wLUTA6vF';
const DODO_PRODUCT_ID = 'pdt_0NnMDvs4DmKQ0QN5rReBn';

export function BidModal({
  isOpen,
  onClose,
  initialSpot = null,
  spots = [],
  currency = 'USD',
  onConfirmBid,
}) {
  const [selectedRank, setSelectedRank] = useState(1);
  const [brandName, setBrandName] = useState('');
  const [url, setUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bidAmountUSD, setBidAmountUSD] = useState(150);
  const [inputCurrency, setInputCurrency] = useState(currency || 'USD');
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

      const currentSpot = spots.find(s => s.rank === targetRank);
      const isOccupied = currentSpot && currentSpot.brandName;
      const basePrice = SPOT_BASE_PRICES[targetRank] || 20;
      const minRequired = isOccupied ? (currentSpot.bidAmount + 5) : basePrice;
      setBidAmountUSD(minRequired);

      if (!url) {
        setUrl('');
        setBrandName('');
        setLogoUrl('');
      }
    }
  }, [isOpen, initialSpot, spots]);

  const currentSpot = spots.find(s => s.rank === selectedRank);
  const isOccupied = currentSpot && Boolean(currentSpot.brandName);
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
        }
        const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        setLogoUrl(favicon);
      }
    } catch (e) {}
  };

  const handleRankChange = (rank) => {
    playClick();
    const r = Number(rank);
    setSelectedRank(r);
    const spot = spots.find(s => s.rank === r);
    const occupied = spot && spot.brandName;
    const base = SPOT_BASE_PRICES[r] || 20;
    const min = occupied ? (spot.bidAmount + 5) : base;
    setBidAmountUSD(min);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMsg('Image size should be under 3MB');
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
      setErrorMsg('Please enter your brand name');
      return;
    }
    if (!url.trim()) {
      setErrorMsg('Please enter your website URL');
      return;
    }
    if (bidAmountUSD < minRequiredBidUSD) {
      setErrorMsg(`Minimum bid for Spot #${selectedRank} is $${minRequiredBidUSD} USD`);
      return;
    }

    playClick();
    setIsProcessing(true);
    setErrorMsg('');
    setStatusMessage('Connecting to Dodo Payments checkout...');

    const cleanBidData = {
      rank: selectedRank,
      brandName: brandName.trim(),
      url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
      tagline: `${brandName.trim()} on iPhone Duo`,
      bidAmountUSD: Number(bidAmountUSD),
      logoBg: '#18181b',
      logoText: brandName.trim().slice(0, 2).toUpperCase() || '★',
      logoUrl: logoUrl || null,
    };

    // Save pending bid to sessionStorage
    try {
      sessionStorage.setItem('tinyspot_pending_bid', JSON.stringify({
        ...cleanBidData,
        bidAmount: Number(bidAmountUSD),
      }));
    } catch (err) {}

    try {
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

      // Direct client-side Dodo Payments API fallback
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
                quantity: 1,
                amount: Math.round(Number(bidAmountUSD) * 100),
              },
            ],
            return_url: `${window.location.origin}/?success=true&rank=${selectedRank}`,
            metadata: {
              rank: String(selectedRank),
              brandName: cleanBidData.brandName,
              url: cleanBidData.url,
              tagline: cleanBidData.tagline,
              amountUSD: String(cleanBidData.bidAmountUSD),
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

      // Offline / Local save fallback
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md my-auto overflow-hidden rounded-3xl border border-hairline/80 bg-white p-5 sm:p-6 shadow-2xl">
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
              Dodo Payments
            </span>
            <span className="text-[11px] font-medium text-ink-2">
              {selectedRank <= 5 ? 'Outside Screen (Top 5)' : 'Inside Screen (Ranks 6–20)'}
            </span>
          </div>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-ink">
            Claim Spot #{selectedRank} on iPhone Duo
          </h3>
          <p className="mt-1 text-[13px] text-ink-2">
            Put your brand on Apple's first iPhone Duo. Goes live immediately upon payment.
          </p>
        </div>

        {errorMsg && (
          <div className="mt-3 rounded-xl bg-red-50 p-2.5 text-[12px] font-medium text-red-700 border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Spot Selector Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-2 mb-1">
              Choose Spot / Rank
            </label>
            <select
              value={selectedRank}
              onChange={(e) => handleRankChange(e.target.value)}
              className="w-full rounded-xl border border-hairline bg-mist/40 px-3 py-2 text-[13px] font-semibold text-ink outline-none focus:border-ink focus:bg-white transition-all cursor-pointer"
            >
              <optgroup label="Outside Screen (Premier Top 5)">
                {[1, 2, 3, 4, 5].map(r => {
                  const s = spots.find(spot => spot.rank === r);
                  const price = s?.brandName ? (s.bidAmount + 5) : (SPOT_BASE_PRICES[r] || 20);
                  return (
                    <option key={r} value={r}>
                      Spot #{r} — {s?.brandName ? `Outbid ${s.brandName} from $${price}` : `Vacant (Base: $${price})`}
                    </option>
                  );
                })}
              </optgroup>
              <optgroup label="Inside Screen (Ranks 6–20)">
                {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(r => {
                  const s = spots.find(spot => spot.rank === r);
                  const price = s?.brandName ? (s.bidAmount + 5) : (SPOT_BASE_PRICES[r] || 20);
                  return (
                    <option key={r} value={r}>
                      Spot #{r} — {s?.brandName ? `Outbid ${s.brandName} from $${price}` : `Vacant (Base: $${price})`}
                    </option>
                  );
                })}
              </optgroup>
            </select>
          </div>

          {/* 1. Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-2 mb-1">
              Brand / Project Name *
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => { setBrandName(e.target.value); setErrorMsg(''); }}
              placeholder="e.g. Acme, Linear, Supabase"
              required
              className="w-full rounded-xl border border-hairline bg-white px-3.5 py-2 text-[14px] text-ink outline-none focus:border-ink transition-all shadow-xs"
            />
          </div>

          {/* 2. Website */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-2 mb-1">
              Website URL *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://yourbrand.com"
              required
              className="w-full rounded-xl border border-hairline bg-white px-3.5 py-2 text-[14px] text-ink outline-none focus:border-ink transition-all shadow-xs"
            />
          </div>

          {/* 3. Logo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-2 mb-1">
              Logo
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-hairline bg-mist/30 p-2.5">
              {/* Logo Preview */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-white font-bold text-sm shadow-xs overflow-hidden border border-black/10">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="h-full w-full object-contain p-1"
                    onError={() => setLogoUrl('')}
                  />
                ) : (
                  <span>{brandName ? brandName.slice(0, 2).toUpperCase() : '★'}</span>
                )}
              </div>

              {/* Upload or clear */}
              <div className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 rounded-lg border border-hairline bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-mist transition-colors shadow-xs"
                >
                  <Upload className="h-3.5 w-3.5 text-ink-2" />
                  <span>Upload Logo</span>
                </button>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="text-[11px] text-ink-2 hover:text-red-600 underline font-medium"
                  >
                    Reset
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* 4. Money / Bid Amount (Start from base price, enter any amount) */}
          <div className="rounded-2xl border border-hairline/80 bg-mist/40 p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-2">
                Your Bid Amount
              </label>
              {/* Currency Selector */}
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

            {/* Custom Amount Input */}
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

            {/* Quick Increment Presets */}
            <div className="mt-2 flex items-center gap-1.5">
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
                      setBidAmountUSD(prev => Math.max(minRequiredBidUSD, prev + bump));
                    }
                  }}
                  className="flex-1 rounded-lg border border-hairline bg-white py-1 text-[11px] font-semibold text-ink hover:bg-mist hover:border-ink-2/40 transition-colors shadow-xs"
                >
                  +{inputCurrency === 'INR' ? `₹${bump.toLocaleString()}` : `$${bump}`}
                </button>
              ))}
            </div>

            <div className="mt-2 text-[10px] text-ink-2 flex justify-between items-center">
              <span>Starts from base: <strong>${minRequiredBidUSD} USD</strong> (₹{usdToInr(minRequiredBidUSD).toLocaleString()})</span>
              <span className="text-emerald-700 font-medium">Min step: +$5 / +₹500</span>
            </div>
          </div>

          {/* Submit CTA with Dodo Payments */}
          <button
            type="submit"
            disabled={isProcessing || bidAmountUSD < minRequiredBidUSD}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 text-[15px] font-bold text-white shadow-lg transition-all duration-200 hover:bg-orange-700 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <span>{statusMessage || 'Connecting to Dodo Payments...'}</span>
            ) : (
              <>
                <span>Pay ${bidAmountUSD} USD (≈ ₹{usdToInr(bidAmountUSD).toLocaleString()}) to Claim</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

