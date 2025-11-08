import { products, favoritesManager, cartManager, productManager } from './data.js';

window.productManager = productManager;
window.favoritesManager = favoritesManager;
window.cartManager = cartManager;

// === Обновление бейджей ===
function updateFavoritesBadge() {
  const badge = document.querySelector('.icon-btn[href*="favorites"] .badge');
  if (badge) {
    const count = favoritesManager.getFavorites().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const cart = cartManager.getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
  }
}

// === Создание карточки товара ===
function createProductCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const isFavorite = favoritesManager.isFavorite(product.id);
  const inCart = cartManager.isInCart?.(product.id) || false;

  card.innerHTML = `
  <img src="${product.image}" alt="${product.name}" class="product-card-image">
  <h3 class="product-name">${product.name}</h3>
  <div class="product-rating">
    ${"⭐".repeat(Math.floor(product.rating))} 
    <span>${product.rating}</span>
  </div>
  <p class="product-description">${product.description}</p>
  <div class="product-footer">
    <p class="product-price">$${product.price}</p>
    <div class="product-actions">
      <button class="product-favorite" data-id="${product.id}" title="Избранное">
        ${isFavorite ? '❤️' : '🤍'}
      </button>
      <button class="btn-add-cart" data-id="${product.id}" title="Добавить в корзину">
        🛒
      </button>
    </div>
  </div>
`;

  // Переход на страницу товара (если не нажали на кнопки)
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.product-favorite') && !e.target.closest('.btn-add-cart')) {
      window.location.href = `/block/product.html?id=${product.id}`;
    }
  });

  // === Обработчик избранных ===
  const favoriteBtn = card.querySelector('.product-favorite');
  favoriteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isNowFavorite = favoritesManager.toggleFavorite(product.id);
    favoriteBtn.classList.toggle('active', isNowFavorite);
    updateFavoritesBadge();
    showNotification(isNowFavorite ? 'Добавлено в избранное' : 'Удалено из избранного');
  });

  // === Обработчик корзины ===
  const cartBtn = card.querySelector('.btn-add-cart');
  cartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cartManager.addToCart(product);
    cartBtn.classList.add('active');
    updateCartBadge();
    showNotification('Товар добавлен в корзину');
  });

  return card;
}

// === Уведомления ===
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// === Рендер товаров ===
const container = document.getElementById("products-container");
if (container) {
  const displayProducts = products.slice(0, 8);
  displayProducts.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

// === Инициализация после загрузки ===
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateFavoritesBadge();

  const favLink = document.querySelector('.icon-btn[href*="favorites"]');
  if (favLink && !favLink.querySelector('.badge')) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.display = 'none';
    favLink.appendChild(badge);
  }
});
