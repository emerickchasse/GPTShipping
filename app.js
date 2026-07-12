const price = 24;
let cartQuantity = 0;

const cart = document.querySelector('#cart');
const overlay = document.querySelector('#overlay');
const cartButton = document.querySelector('.cart-button');
const count = document.querySelector('#cart-count');
const empty = document.querySelector('#cart-empty');
const filled = document.querySelector('#cart-filled');

function setCartOpen(open) {
  cart.classList.toggle('open', open);
  cart.setAttribute('aria-hidden', String(!open));
  cartButton.setAttribute('aria-expanded', String(open));
  overlay.hidden = !open;
  if (open) document.querySelector('#close-cart').focus();
}

function renderCart() {
  count.textContent = cartQuantity;
  empty.hidden = cartQuantity > 0;
  filled.hidden = cartQuantity === 0;
  document.querySelector('#cart-quantity').textContent = cartQuantity;
  document.querySelector('#cart-total').textContent = `$${(cartQuantity * price).toFixed(2)} USD`;
}

document.querySelector('#add-to-cart').addEventListener('click', () => {
  cartQuantity += Number(document.querySelector('#quantity').value);
  renderCart();
  setCartOpen(true);
});

cartButton.addEventListener('click', () => setCartOpen(true));
document.querySelector('#close-cart').addEventListener('click', () => setCartOpen(false));
overlay.addEventListener('click', () => setCartOpen(false));

document.querySelector('#checkout').addEventListener('click', async (event) => {
  const checkout = event.currentTarget;
  const message = document.querySelector('#checkout-message');
  checkout.disabled = true;
  checkout.textContent = 'Opening secure checkout…';
  message.textContent = 'Checking live checkout availability…';
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: cartQuantity })
    });
    const payload = await response.json();
    if (!response.ok || !payload.checkoutUrl) throw new Error(payload.error || 'Checkout is unavailable.');
    window.location.assign(payload.checkoutUrl);
  } catch (error) {
    message.textContent = error.message;
    checkout.disabled = false;
    checkout.textContent = 'Continue to secure checkout';
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
renderCart();
