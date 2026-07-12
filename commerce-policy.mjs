export function normalizeCheckoutMode(value) {
  if (value === 'test' || value === 'live') return value;
  throw new Error('STRIPE_CHECKOUT_MODE must be exactly "test" or "live".');
}

export function shouldFulfillStripeSession(session, checkoutMode) {
  const expectedLivemode = normalizeCheckoutMode(checkoutMode) === 'live';
  return session?.livemode === expectedLivemode
    && session?.payment_status === 'paid'
    && session?.metadata?.store === 'pawswipe';
}
