function nonNegativeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

export function netRevenueCents(session, refundedCents) {
  const amountTotal = nonNegativeInteger(session?.amount_total);
  const amountTax = nonNegativeInteger(session?.total_details?.amount_tax) ?? 0;
  const refunded = nonNegativeInteger(refundedCents);

  if (amountTotal === null || refunded === null || amountTax > amountTotal) return 0;
  return Math.max(0, amountTotal - amountTax - refunded);
}
