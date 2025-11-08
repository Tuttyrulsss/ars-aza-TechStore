import {
  productManager,
  favoritesManager,
  cartManager,
  updateCartBadge,
  updateFavoritesBadge
} from './data.js';

// Определяем эмодзи для категорий
const categoryEmojis = {
  'phones': '📱',
  'laptops': '💻',
  'accessories': '🎧',
  'tablets': '📱',
  'smartwatches': '⌚'
};

// Показать уведомление
function showNotification(message) {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

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

// Создать карточку избранного товара
function createFavoriteCard(product) {
  const card = document.createElement('div');
  card.className = 'favorite-card';

  const emoji = categoryEmojis[product.category] || '📦';
  const inCart = cartManager.isInCart(product.id);

  card.innerHTML = `
    <div class="favorite-card-header">
      <button class="remove-favorite" data-id="${product.id}" title="Удалить из избранного">
        ❌
      </button>
    </div>
    <div class="favorite-image">${emoji}</div>
    <h3 class="favorite-name">${product.name}</h3>
    <div class="favorite-rating">
      ${"⭐".repeat(Math.floor(product.rating))} 
      <span>${product.rating}</span>
    </div>
    <p class="favorite-description">${product.description}</p>
    <div class="favorite-footer">
      <div class="favorite-price">${product.price}</div>
      <div class="favorite-actions">
        <button class="btn-add-to-cart ${inCart ? 'in-cart' : ''}" data-id="${product.id}">
          ${inCart ? '✓ В корзине' : '🛒 В корзину'}
        </button>
      </div>
    </div>
  `;

  // Переход на страницу товара при клике на карточку
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.remove-favorite') && !e.target.closest('.btn-add-to-cart')) {
      window.location.href = `/block/product.html?id=${product.id}`;
    }
  });

  // Удаление из избранного
  const removeBtn = card.querySelector('.remove-favorite');
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    favoritesManager.removeFavorite(product.id);
    card.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      card.remove();
      updateFavoritesBadge();
      renderFavorites();
      showNotification('💔 Товар удален из избранного');
    }, 300);
  });

  // Добавление в корзину
  const cartBtn = card.querySelector('.btn-add-to-cart');
  cartBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!cartManager.isInCart(product.id)) {
      cartManager.addToCart(product);
      cartBtn.classList.add('in-cart');
      cartBtn.textContent = '✓ В корзине';
      updateCartBadge();
      showNotification('✅ Товар добавлен в корзину');
    } else {
      showNotification('ℹ️ Товар уже в корзине');
    }
  });

  return card;
}

// Отрисовка избранных товаров
function renderFavorites() {
  const favoritesGrid = document.getElementById('favoritesGrid');
  const emptyFavorites = document.getElementById('emptyFavorites');
  const clearAllBtn = document.getElementById('clearAllBtn');

  const favoriteIds = favoritesManager.getFavorites();
  const allProducts = productManager.getProducts();
  const favoriteProducts = allProducts.filter(p => favoriteIds.includes(p.id));

  if (favoriteProducts.length === 0) {
    // Показываем пустое состояние
    emptyFavorites.style.display = 'block';
    favoritesGrid.style.display = 'none';
    clearAllBtn.style.display = 'none';
  } else {
    // Показываем товары
    emptyFavorites.style.display = 'none';
    favoritesGrid.style.display = 'grid';
    clearAllBtn.style.display = 'flex';

    favoritesGrid.innerHTML = '';
    favoriteProducts.forEach(product => {
      const card = createFavoriteCard(product);
      favoritesGrid.appendChild(card);
    });
  }
}

// Очистить всё избранное
function clearAllFavorites() {
  if (confirm('Вы уверены, что хотите удалить все товары из избранного?')) {
    const favoriteIds = favoritesManager.getFavorites();
    favoriteIds.forEach(id => favoritesManager.removeFavorite(id));

    updateFavoritesBadge();
    renderFavorites();
    showNotification('🗑️ Все товары удалены из избранного');
  }
}

// Инициализация меню каталога
function initCatalogMenu() {
  const catalogBtn = document.getElementById('catalogBtn');
  const catalogMenu = document.getElementById('catalogMenu');
  const catalogOverlay = document.getElementById('catalogOverlay');

  if (!catalogBtn || !catalogMenu) return;

  let isOpening = false;

  function openCatalog() {
    isOpening = true;
    catalogMenu.classList.add('active');
    if (catalogOverlay) catalogOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      isOpening = false;
    }, 100);
  }

  function closeCatalog() {
    catalogMenu.classList.remove('active');
    if (catalogOverlay) catalogOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  catalogBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (catalogMenu.classList.contains('active')) {
      closeCatalog();
    } else {
      openCatalog();
    }
  });

  if (catalogOverlay) {
    catalogOverlay.addEventListener('click', (e) => {
      if (!isOpening) {
        closeCatalog();
      }
    });
  }

  document.addEventListener('mousedown', (e) => {
    if (isOpening) return;

    if (catalogMenu.classList.contains('active') &&
      !catalogMenu.contains(e.target) &&
      !catalogBtn.contains(e.target)) {
      closeCatalog();
    }
  });

  catalogMenu.addEventListener('mousedown', (e) => {
    e.stopPropagation();

    if (e.target.tagName === 'A' || e.target.closest('a')) {
      setTimeout(() => closeCatalog(), 100);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && catalogMenu.classList.contains('active')) {
      closeCatalog();
    }
  });
}

// Поиск товаров
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');

  function performSearch() {
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/block/catalog.html?search=${encodeURIComponent(query)}`;
    }
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
}

// Анимация fadeOut
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateFavoritesBadge();
  renderFavorites();
  initCatalogMenu();
  initSearch();

  // Обработчик кнопки "Очистить всё"
  const clearAllBtn = document.getElementById('clearAllBtn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllFavorites);
  }
});