let launchStatusViewed = false;

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
  count.textContent = launchStatusViewed ? '1' : '0';
  empty.hidden = launchStatusViewed;
  filled.hidden = !launchStatusViewed;
}

document.querySelector('#add-to-cart').addEventListener('click', () => {
  launchStatusViewed = true;
  renderCart();
  setCartOpen(true);
});

cartButton.addEventListener('click', () => setCartOpen(true));
document.querySelector('#close-cart').addEventListener('click', () => setCartOpen(false));
overlay.addEventListener('click', () => setCartOpen(false));

document.querySelector('#year').textContent = new Date().getFullYear();
renderCart();
