export function normalizeCheckoutMode(value) {
  if (value === 'test' || value === 'live') return value;
  throw new Error('STRIPE_CHECKOUT_MODE must be exactly "test" or "live".');
}

const attributionSources = new Set([
  'direct',
  'google',
  'github',
  'pinterest',
  'x',
  'email',
  'care_guide',
  'size_guide',
  'measure_guide',
  'tie_guide',
  'comparison_guide',
  'cat_guide'
]);

export function normalizeAttributionSource(value) {
  if (typeof value !== 'string') return 'direct';
  const normalized = value.trim().toLowerCase();
  return attributionSources.has(normalized) ? normalized : 'direct';
}

export function shouldFulfillStripeSession(session, checkoutMode) {
  const expectedLivemode = normalizeCheckoutMode(checkoutMode) === 'live';
  return session?.livemode === expectedLivemode
    && session?.payment_status === 'paid'
    && session?.metadata?.store === 'pawswipe';
}
