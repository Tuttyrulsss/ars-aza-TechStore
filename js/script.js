import {
  products,
  favoritesManager,
  cartManager,
  productManager,
  updateCartBadge,
  updateFavoritesBadge
} from './data.js';

// Делаем менеджеры доступными глобально
window.productManager = productManager;
window.favoritesManager = favoritesManager;
window.cartManager = cartManager;

// === Создание карточки товара ===
function createProductCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const isFavorite = favoritesManager.isFavorite(product.id);
  const inCart = cartManager.isInCart(product.id);

  // Определяем эмодзи для категории
  const categoryEmojis = {
    'phones': '📱',
    'laptops': '💻',
    'accessories': '🎧',
    'tablets': '📱',
    'smartwatches': '⌚'
  };
  const emoji = categoryEmojis[product.category] || '📦';

  card.innerHTML = `
    <div class="product-image">${emoji}</div>
    <h3 class="product-name">${product.name}</h3>
    <div class="product-rating">
      ${"⭐".repeat(Math.floor(product.rating))} 
      <span>${product.rating}</span>
    </div>
    <p class="product-description">${product.description}</p>
    <div class="product-footer">
      <p class="product-price">${product.price}</p>
      <div class="product-actions">
        <button class="product-favorite ${isFavorite ? 'active' : ''}" data-id="${product.id}" title="Избранное">
          ${isFavorite ? '❤️' : '🤍'}
        </button>
        <button class="btn-add-cart ${inCart ? 'active' : ''}" data-id="${product.id}" title="Добавить в корзину">
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
    const productId = parseInt(favoriteBtn.dataset.id);
    const isNowFavorite = favoritesManager.toggleFavorite(productId);

    // Обновляем визуально сразу
    favoriteBtn.classList.toggle('active', isNowFavorite);
    favoriteBtn.textContent = isNowFavorite ? '❤️' : '🤍';

    updateFavoritesBadge();
    showNotification(isNowFavorite ? 'Добавлено в избранное' : 'Удалено из избранного');
  });

  // === Обработчик корзины ===
  const cartBtn = card.querySelector('.btn-add-cart');
  cartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const productId = parseInt(cartBtn.dataset.id);

    // Если товар уже в корзине - удаляем
    if (cartManager.isInCart(productId)) {
      cartManager.removeFromCart(productId);
      cartBtn.classList.remove('active');
      updateCartBadge();
      showNotification('🗑️ Товар удален из корзины');
    } else {
      // Если товара нет - добавляем
      cartManager.addToCart(product);
      cartBtn.classList.add('active');
      updateCartBadge();
      showNotification('✅ Товар добавлен в корзину');
    }
  });
  return card;
}

// === Уведомления ===
function showNotification(message) {
  // Удаляем предыдущее уведомление если есть
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

// === Поиск товаров ===
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');

  function performSearch() {
    if (!searchInput) return;

    const query = searchInput.value.trim();

    if (query) {
      // Переходим на страницу каталога с параметром поиска
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

// === Меню каталога ===
function initCatalogMenu() {
  const catalogBtn = document.getElementById('catalogBtn');
  const catalogMenu = document.getElementById('catalogMenu');
  const catalogOverlay = document.getElementById('catalogOverlay');

  console.log('Инициализация каталога:', { catalogBtn, catalogMenu, catalogOverlay });

  if (!catalogBtn || !catalogMenu) {
    console.error('Не найдены элементы каталога!');
    return;
  }

  let isOpening = false; // Флаг, чтобы отследить процесс открытия

  function openCatalog() {
    console.log('Открываем каталог');
    isOpening = true;
    catalogMenu.classList.add('active');
    if (catalogOverlay) catalogOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Снимаем флаг через небольшую задержку
    setTimeout(() => {
      isOpening = false;
    }, 100);
  }

  function closeCatalog() {
    console.log('Закрываем каталог');
    catalogMenu.classList.remove('active');
    if (catalogOverlay) catalogOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Обработчик кнопки каталога - используем mousedown вместо click
  catalogBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (catalogMenu.classList.contains('active')) {
      closeCatalog();
    } else {
      openCatalog();
    }
  });

  // Закрытие по клику на оверлей
  if (catalogOverlay) {
    catalogOverlay.addEventListener('click', (e) => {
      if (!isOpening) {
        closeCatalog();
      }
    });
  }

  // Закрытие по клику вне меню
  document.addEventListener('mousedown', (e) => {
    // Игнорируем если каталог только открывается
    if (isOpening) return;

    // Проверяем, что клик был НЕ по меню каталога и НЕ по кнопке
    if (catalogMenu.classList.contains('active') &&
      !catalogMenu.contains(e.target) &&
      !catalogBtn.contains(e.target)) {
      closeCatalog();
    }
  });

  // Предотвращаем закрытие при клике внутри меню
  catalogMenu.addEventListener('mousedown', (e) => {
    e.stopPropagation();

    // Если кликнули на ссылку - закрываем
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      setTimeout(() => closeCatalog(), 100);
    }
  });

  // Закрытие при нажатии Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && catalogMenu.classList.contains('active')) {
      closeCatalog();
    }
  });
}

// === Рендер товаров на главной странице ===
function initProducts() {
  const container = document.getElementById("products-container");
  if (container) {
    const allProducts = productManager.getProducts();
    const displayProducts = allProducts.slice(0, 8);

    displayProducts.forEach(product => {
      const card = createProductCard(product);
      container.appendChild(card);
    });
  }
}

// === Инициализация после загрузки DOM ===
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM загружен, начинаем инициализацию');

  // Обновляем бэджи корзины и избранного
  updateCartBadge();
  updateFavoritesBadge();

  // Инициализируем функционал
  initCatalogMenu();
  initSearch();
  initProducts();
});

// Экспортируем функции для использования на других страницах
export { createProductCard, showNotification };