let launchStatusViewed = false;
let selectedSize = '';
let checkoutReady = false;

const checkoutApiBase = window.location.hostname === 'emerickchasse.github.io'
  ? 'https://pawswipe-checkout.onrender.com'
  : '';

const cart = document.querySelector('#cart');
const overlay = document.querySelector('#overlay');
const cartButton = document.querySelector('.cart-button');
const count = document.querySelector('#cart-count');
const empty = document.querySelector('#cart-empty');
const filled = document.querySelector('#cart-filled');
const sizeSelect = document.querySelector('#pet-size');
const selectedSizeOutput = document.querySelector('#selected-size');
const checkoutButton = document.querySelector('#checkout');
const checkoutMessage = document.querySelector('#checkout-message');
const checkoutStatusTitle = document.querySelector('#checkout-status-title');
const checkoutStatusDetail = document.querySelector('#checkout-status-detail');
const productPrice = document.querySelector('#product-price');

async function refreshCheckoutReadiness() {
  try {
    const response = await fetch(`${checkoutApiBase}/api/checkout-readiness`);
    if (!response.ok) throw new Error('Readiness is unavailable.');
    const readiness = await response.json();
    checkoutReady = readiness.ready === true;
    checkoutButton.disabled = !readiness.ready;
    if (checkoutReady) {
      const unitPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
        .format(readiness.unitAmountCents / 100);
      productPrice.textContent = `${unitPrice} USD`;
      checkoutButton.textContent = 'Secure checkout';
      checkoutStatusTitle.textContent = 'Secure checkout is available.';
      checkoutStatusDetail.textContent = 'Shipping and tax are calculated in Stripe Checkout before payment.';
      checkoutMessage.textContent = 'You will review the final total before paying.';
    }
  } catch {
    checkoutReady = false;
    checkoutButton.disabled = true;
  }
}

function setCartOpen(open) {
  cart.classList.toggle('open', open);
  cart.setAttribute('aria-hidden', String(!open));
  cartButton.setAttribute('aria-expanded', String(open));
  overlay.hidden = !open;
  if (open) document.querySelector('#close-cart').focus();
}

function renderCart() {
  count.textContent = launchStatusViewed ? '1' : '0';
  empty.hidden = launchStatusViewed;
  filled.hidden = !launchStatusViewed;
  selectedSizeOutput.textContent = selectedSize;
}

document.querySelector('#add-to-cart').addEventListener('click', () => {
  selectedSize = sizeSelect.value;
  if (!selectedSize) {
    sizeSelect.reportValidity();
    sizeSelect.focus();
    return;
  }
  launchStatusViewed = true;
  renderCart();
  setCartOpen(true);
});

cartButton.addEventListener('click', () => setCartOpen(true));
document.querySelector('#close-cart').addEventListener('click', () => setCartOpen(false));
overlay.addEventListener('click', () => setCartOpen(false));

checkoutButton.addEventListener('click', async () => {
  checkoutButton.disabled = true;
  checkoutMessage.textContent = 'Opening secure checkout…';
  try {
    const response = await fetch(`${checkoutApiBase}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 1, size: selectedSize })
    });
    const result = await response.json();
    if (!response.ok || !result.checkoutUrl) throw new Error(result.error || 'Checkout is unavailable.');
    window.location.assign(result.checkoutUrl);
  } catch (error) {
    checkoutMessage.textContent = error.message;
    checkoutButton.disabled = !checkoutReady;
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
renderCart();
refreshCheckoutReadiness();
