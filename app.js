let launchStatusViewed = false;
let selectedSize = '';

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
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 1, size: selectedSize })
    });
    const result = await response.json();
    if (!response.ok || !result.checkoutUrl) throw new Error(result.error || 'Checkout is unavailable.');
    window.location.assign(result.checkoutUrl);
  } catch (error) {
    checkoutMessage.textContent = error.message;
    checkoutButton.disabled = false;
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
renderCart();
