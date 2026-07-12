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

document.querySelector('#checkout').addEventListener('click', () => {
  document.querySelector('#checkout').textContent = 'Checkout coming at launch';
});

document.querySelector('#email-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#email');
  const message = document.querySelector('#form-message');
  if (!email.validity.valid) {
    message.textContent = 'Please enter a valid email address.';
    email.focus();
    return;
  }
  message.textContent = 'Thanks — you are on the launch list.';
  event.currentTarget.reset();
});

document.querySelector('#year').textContent = new Date().getFullYear();
renderCart();
