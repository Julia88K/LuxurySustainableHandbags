
// ---------------- CART ----------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.querySelectorAll('.add-to-cart').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    cart.push(index); // simple product index
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  });
});

function updateCartCount() {
  const cartCount = document.querySelector('#cart-count');
  if (cartCount) cartCount.textContent = cart.length;
}
updateCartCount();

const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

// Open/Close cart
const cartLink = document.querySelector('a[href="#cart"]');
cartLink?.addEventListener('click', (e) => {
  e.preventDefault();
  renderCart();
  cartModal.style.display = 'flex';
  cartModal.setAttribute('aria-hidden', 'false');
});
document.querySelector('.close-cart')?.addEventListener('click', () => {
  cartModal.style.display = 'none';
  cartModal.setAttribute('aria-hidden', 'true');
});

// Render Cart
function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((index, i) => {
    const productCard = document.querySelectorAll('.product-card')[index];
    if (!productCard) return;
    const name = productCard.querySelector('.product-description').textContent;
    const price = parseFloat(productCard.querySelector('.product-price').textContent.replace('$',''));

    total += price;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    itemDiv.innerHTML = `
      <span>${name} - $${price}</span>
      <button data-index="${i}">Remove</button>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Remove function
  cartItemsContainer.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const removeIndex = btn.getAttribute('data-index');
      cart.splice(removeIndex, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      renderCart();
    });
  });
}

// ---------------- FAVORITES ----------------
const productCards = Array.from(document.querySelectorAll('.product-card'));
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}
function isFavorite(i) { return favorites.includes(i); }
function updateHeart(i) {
  const heart = productCards[i]?.querySelector('.favorite');
  if (!heart) return;
  if (isFavorite(i)) {
    heart.classList.add('favorited');
    heart.style.color = '#ff0000';
    heart.setAttribute('aria-pressed', 'true');
    heart.title = 'Remove from favorites';
  } else {
    heart.classList.remove('favorited');
    heart.style.color = '#eed4ddff';
    heart.setAttribute('aria-pressed', 'false');
    heart.title = 'Add to favorites';
  }
}
function updateFavCount() {
  const el = document.getElementById('fav-count');
  if (el) el.textContent = favorites.length;
}
function toggleFavorite(i) {
  if (isFavorite(i)) {
    favorites = favorites.filter(x => x !== i);
  } else {
    favorites.push(i);
  }
  saveFavorites();
  updateHeart(i);
  updateFavCount();
}

// Hearts init
productCards.forEach((card, i) => {
  const heart = card.querySelector('.favorite');
  if (!heart) return;
  heart.addEventListener('click', () => toggleFavorite(i));
  updateHeart(i);
});
updateFavCount();

// Favorites modal
const favoritesModal = document.getElementById('favorites-modal');
const favoriteItemsContainer = document.getElementById('favorite-items');
const favLink = document.querySelector('a[href="#favorites"]');

favLink?.addEventListener('click', (e) => {
  e.preventDefault();
  renderFavorites();
  favoritesModal.style.display = 'flex';
  favoritesModal.setAttribute('aria-hidden', 'false');
});
document.querySelector('.close-favorites')?.addEventListener('click', () => {
  favoritesModal.style.display = 'none';
  favoritesModal.setAttribute('aria-hidden', 'true');
});

function renderFavorites() {
  favoriteItemsContainer.innerHTML = '';
  if (favorites.length === 0) {
    favoriteItemsContainer.innerHTML = '<p>No favorites yet.</p>';
    return;
  }
  favorites.forEach(i => {
    const card = productCards[i];
    if (!card) return;
    const name = card.querySelector('.product-description')?.textContent || 'Item';
    const price = card.querySelector('.product-price')?.textContent || '';
    const imgSrc = card.querySelector('img')?.getAttribute('src') || '';

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${imgSrc}" alt="${name}" style="width:50px;height:auto;">
        <div>
          <div>${name}</div>
          <div style="font-weight:700; color:#d6336c;">${price}</div>
        </div>
      </div>
      <button class="remove-fav" data-index="${i}">Remove</button>
    `;
    favoriteItemsContainer.appendChild(row);
  });

  favoriteItemsContainer.querySelectorAll('.remove-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      toggleFavorite(idx);
      renderFavorites();
    });
  });
}

// ---------------- TESTIMONIALS ----------------
let currentIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
const total = testimonials.length;

function showTestimonial(index) {
  testimonials.forEach((t) => t.classList.remove('active'));
  testimonials[index].classList.add('active');
}
showTestimonial(currentIndex);

setInterval(() => {
  currentIndex = (currentIndex + 1) % total;
  showTestimonial(currentIndex);
}, 5000);

document.querySelector('.next')?.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % total;
  showTestimonial(currentIndex);
});
document.querySelector('.prev')?.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + total) % total;
  showTestimonial(currentIndex);
});

// ---------------- MEMBERSHIP ----------------
const memberLink = document.getElementById('open-member');
const heroMember = document.getElementById('hero-member');
const memberModal = document.getElementById('member-modal');
const closeMember = document.querySelector('.close-member');
const memberForm = document.getElementById('member-form');
const memberSuccess = document.getElementById('member-success');
const memberCountEl = document.getElementById('member-count');

// Init members from localStorage
let members = JSON.parse(localStorage.getItem('members') || '[]');
updateMemberCount();

function openMemberModal(e) {
  e?.preventDefault();
  if (!memberModal) return;
  memberModal.style.display = 'flex';
  memberModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.getElementById('m-name')?.focus(), 50);
}
function closeMemberModal() {
  if (!memberModal) return;
  memberModal.style.display = 'none';
  memberModal.setAttribute('aria-hidden', 'true');
}

memberLink?.addEventListener('click', openMemberModal);
heroMember?.addEventListener('click', openMemberModal);
closeMember?.addEventListener('click', closeMemberModal);
memberModal?.addEventListener('click', (e) => {
  if (e.target === memberModal) closeMemberModal();
});

function setError(id, msg) {
  const small = document.querySelector(`.error[data-for="${id}"]`);
  if (small) small.textContent = msg || '';
}
function clearErrors() {
  ['m-name','m-email','m-consent'].forEach(id => setError(id, ''));
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function updateMemberCount() {
  if (memberCountEl) memberCountEl.textContent = members.length;
}

memberForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  memberSuccess.hidden = true;

  const name = document.getElementById('m-name')?.value.trim();
  const email = document.getElementById('m-email')?.value.trim().toLowerCase();
  const pref = document.getElementById('m-preferences')?.value || '';
  const consent = document.getElementById('m-consent')?.checked;

  let ok = true;
  if (!name) { setError('m-name', 'Ange ditt namn.'); ok = false; }
  if (!email || !isValidEmail(email)) { setError('m-email', 'Ange en giltig e-post.'); ok = false; }
  if (!consent) { setError('m-consent', 'Vi behöver ditt samtycke.'); ok = false; }

  if (ok && members.some(m => m.email === email)) {
    setError('m-email', 'Den här e-posten är redan medlem.');
    ok = false;
  }
  if (!ok) return;

  const newMember = { name, email, pref, joinedAt: new Date().toISOString() };
  members.push(newMember);
  localStorage.setItem('members', JSON.stringify(members));
  updateMemberCount();

  memberForm.reset();
  memberSuccess.hidden = false;

  setTimeout(() => {
    memberSuccess.hidden = true;
    closeMemberModal();
  }, 2200);
});
