# PawSwipe launch notification operations

Public form: https://docs.google.com/forms/d/e/1FAIpQLSfpOMdF9D2Sk7YYiIMDnnLD6Q-yQDkyrHnp2TqT5pi32NFzLg/viewform

Last verified: July 12, 2026.

## Contract

- Collect only a validated email address and the required launch-notice consent.
- Send at most one PawSwipe email when Pet Parade ordering opens for eligible US destinations.
- Do not use the address for recurring newsletters, promotions, profiling, lookalike audiences, or unrelated products.
- Google Forms hosts the intake. Owner notifications for new responses are enabled.
- Delete each address within 30 days after the one launch notice is sent, or earlier after a verified deletion request through private support.
- If ordering does not open, review and delete the entire list no later than July 12, 2027 unless the person renews consent.
- Never place response data, counts, or addresses in Git, public logs, analytics, screenshots, or project memory.

## Evidence

The published respondent URL returned anonymous HTTP 200 with the exact title, email field, and consent field, without exposing the owner mailbox. A synthetic `example.com` response passed email validation and consent, produced the recorded-response state, and was then permanently deleted. The queue returned to zero responses. Owner email notifications remained enabled after deletion.

The test proves the intake and cleanup path. It does not prove a real subscriber, deliverability of the future notice, a visit, an order, or revenue.

## Launch send checklist

1. Confirm checkout is truly live and limited to the market stated in the consent.
2. Export addresses only into the private sending workflow; do not add third-party tracking.
3. Send one plain launch email with the storefront URL, why the recipient is receiving it, and the private deletion/support route.
4. Record only aggregate sent/delivered/bounced counts and the send date in private operations evidence.
5. Remove bounced addresses immediately and delete all remaining addresses within 30 days.

