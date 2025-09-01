
// Favoriten toggeln
//document.querySelectorAll('.favorite').forEach(heart => {
    //heart.addEventListener('click', () => {
       // heart.classList.toggle('favorited');
        //if(heart.classList.contains('favorited')){
        //    heart.style.color = '#ff0000';
        //} else {
        //    heart.style.color = '#d6336c';
        //}
    //});
//});

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.querySelectorAll('.add-to-cart').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        cart.push(index); // oder Produkt-ID
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    });
});

function updateCartCount(){
    const cartCount = document.querySelector('#cart-count');
    if(cartCount) cartCount.textContent = cart.length;
}

// ---------- FAVORITES ----------
const productCards = Array.from(document.querySelectorAll('.product-card'));
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(i) {
  return favorites.includes(i);
}

function updateHeart(i) {
  const heart = productCards[i].querySelector('.favorite');
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

// Hearts initialisieren (nur EIN Listener pro Herz!)
productCards.forEach((card, i) => {
  const heart = card.querySelector('.favorite');
  if (!heart) return;
  heart.addEventListener('click', () => toggleFavorite(i));
  updateHeart(i);
});
updateFavCount();

// ---------- FAVORITES MODAL ----------
const favoritesModal = document.getElementById('favorites-modal');
const favoriteItemsContainer = document.getElementById('favorite-items');

const favLink = document.querySelector('a[href="#favorites"]');
if (favLink) {
  favLink.addEventListener('click', (e) => {
    e.preventDefault();
    renderFavorites();
    favoritesModal.style.display = 'flex';
  });
}

const closeFav = document.querySelector('.close-favorites');
if (closeFav) {
  closeFav.addEventListener('click', () => {
    favoritesModal.style.display = 'none';
  });
}

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

  // Remove-Buttons im Modal
  favoriteItemsContainer.querySelectorAll('.remove-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      toggleFavorite(idx);
      renderFavorites();
    });
  });
}


// Initial
updateCartCount();

let currentIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
const total = testimonials.length;

function showTestimonial(index) {
    testimonials.forEach((t, i) => t.classList.remove('active'));
    testimonials[index].classList.add('active');
}

// Initial anzeigen
showTestimonial(currentIndex);

// Automatisches wechseln alle 5 Sekunden
setInterval(() => {
    currentIndex = (currentIndex + 1) % total;
    showTestimonial(currentIndex);
}, 5000);

// Pfeile
document.querySelector('.next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % total;
    showTestimonial(currentIndex);
});

document.querySelector('.prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + total) % total;
    showTestimonial(currentIndex);
});

const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

// Öffnen/Schließen
document.querySelector('a[href="#cart"]').addEventListener('click', (e) => {
    e.preventDefault();
    renderCart();
    cartModal.style.display = 'flex';
});

document.querySelector('.close-cart').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Render Cart
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((index, i) => {
        const productCard = document.querySelectorAll('.product-card')[index];
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

    // Remove Funktion
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

