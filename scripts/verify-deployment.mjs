const expectedCommit = (process.argv[2] || process.env.EXPECTED_GIT_COMMIT || '').trim().toLowerCase();
const baseUrl = (process.env.CHECKOUT_BASE_URL || 'https://pawswipe-checkout.onrender.com').replace(/\/$/, '');

if (!/^[0-9a-f]{40}$/.test(expectedCommit)) {
  console.error('Provide the expected full 40-character commit SHA as the first argument or EXPECTED_GIT_COMMIT.');
  process.exitCode = 2;
} else {
  try {
    const response = await fetch(`${baseUrl}/api/version`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`version endpoint returned HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.commit !== expectedCommit) {
      throw new Error(`deployment mismatch: expected ${expectedCommit.slice(0, 7)}, live ${String(payload.commit || 'unknown').slice(0, 7)}`);
    }
    console.log(`Render deployment matches ${expectedCommit.slice(0, 7)}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
