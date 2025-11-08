// Список товаров
export const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "phones",
    price: "$999",
    rating: 4.8,
    description: "Новейший iPhone с чипом A17 Pro и титановым дизайном",
    image: "img/iphon.jpg",
    popularity: 95,
  },
  {
    id: 2,
    name: "MacBook Pro 16",
    category: "laptops",
    price: "$2499",
    rating: 4.9,
    description: "Мощный ноутбук с чипом M3 Max для профессионалов",
    image: "img/iphon.jpg",
    popularity: 90,
  },
  {
    id: 3,
    name: "AirPods Pro",
    category: "accessories",
    price: "$249",
    rating: 4.7,
    description: "Премиальные беспроводные наушники с активным шумоподавлением",
    image: "img/iphon.jpg",
    popularity: 88,
  },
  {
    id: 4,
    name: "iPad Air",
    category: "tablets",
    price: "$599",
    rating: 4.6,
    description: "Универсальный планшет с чипом M1 и потрясающим дисплеем",
    image: "img/iphon.jpg",
    popularity: 85,
  },
  {
    id: 5,
    name: "Apple Watch Ultra",
    category: "smartwatches",
    price: "$799",
    rating: 4.8,
    description: "Прочные умные часы для экстремальных приключений",
    image: "img/iphon.jpg",
    popularity: 82,
  },
  {
    id: 6,
    name: "Samsung Galaxy S24",
    category: "phones",
    price: "$899",
    rating: 4.7,
    description: "Флагманский Android-телефон с функциями ИИ",
    image: "img/iphon.jpg",
    popularity: 87,
  },
  {
    id: 7,
    name: "Dell XPS 15",
    category: "laptops",
    price: "$1799",
    rating: 4.6,
    description: "Премиальный ноутбук на Windows с потрясающим дисплеем",
    image: "img/iphon.jpg",
    popularity: 80,
  },
  {
    id: 8,
    name: "Sony WH-1000XM5",
    category: "accessories",
    price: "$399",
    rating: 4.9,
    description: "Лучшие в отрасли наушники с шумоподавлением",
    image: "img/iphon.jpg",
    popularity: 92,
  },
];

// === Локальное хранилище ===
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Ошибка чтения ${key}:`, error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Ошибка сохранения ${key}:`, error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Ошибка удаления ${key}:`, error);
    }
  },
};

// === Менеджер пользователя ===
const userManager = {
  getCurrentUser: () => storage.get("currentUser"),
  setCurrentUser: (user) => storage.set("currentUser", user),
  logout: () => storage.remove("currentUser"),
  getUsers: () => storage.get("users") || [],
  addUser: (user) => {
    const users = userManager.getUsers();
    users.push(user);
    storage.set("users", users);
  },
  updateUser: (email, updates) => {
    const users = userManager.getUsers();
    const index = users.findIndex((u) => u.email === email);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      storage.set("users", users);
      if (userManager.getCurrentUser()?.email === email) {
        userManager.setCurrentUser(users[index]);
      }
    }
  },
  findUser: (email) => {
    const users = userManager.getUsers();
    return users.find((u) => u.email === email);
  },
};

// === Менеджер корзины ===
const cartManager = {
  getCart: () => storage.get("cart") || [],

  addToCart: (product, quantity = 1) => {
    const cart = cartManager.getCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    storage.set("cart", cart);
    updateCartBadge();
  },

  updateQuantity: (productId, quantity) => {
    const cart = cartManager.getCart();
    const item = cart.find((item) => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity); // Минимум 1
      storage.set("cart", cart);
      updateCartBadge();
    }
  },

  removeFromCart: (productId) => {
    let cart = cartManager.getCart();
    cart = cart.filter((item) => item.id !== productId);
    storage.set("cart", cart);
    updateCartBadge();
  },

  clearCart: () => {
    storage.set("cart", []);
    updateCartBadge();
  },

  getTotal: () => {
    const cart = cartManager.getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // ИСПРАВЛЕНО: Добавлен метод isInCart
  isInCart: (productId) => {
    const cart = cartManager.getCart();
    return cart.some((item) => item.id === productId);
  },

  getCartCount: () => {
    const cart = cartManager.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
};

// === Менеджер избранного ===
const favoritesManager = {
  key: "favorites",

  getFavorites() {
    return storage.get(this.key) || [];
  },

  saveFavorites(favs) {
    storage.set(this.key, favs);
  },

  toggleFavorite(id) {
    const favs = this.getFavorites();
    const index = favs.indexOf(id);

    if (index === -1) {
      favs.push(id);
    } else {
      favs.splice(index, 1);
    }

    this.saveFavorites(favs);
    return favs.includes(id);
  },

  isFavorite(id) {
    return this.getFavorites().includes(id);
  },

  addFavorite(id) {
    const favs = this.getFavorites();
    if (!favs.includes(id)) {
      favs.push(id);
      this.saveFavorites(favs);
    }
  },

  removeFavorite(id) {
    let favs = this.getFavorites();
    favs = favs.filter(favId => favId !== id);
    this.saveFavorites(favs);
  }
};

// === Менеджер заказов ===
const ordersManager = {
  getOrders: () => storage.get("orders") || [],

  addOrder: (order) => {
    const orders = ordersManager.getOrders();
    // Добавляем ID и дату
    order.id = Date.now();
    order.date = new Date().toISOString();
    orders.unshift(order);
    storage.set("orders", orders);
  },

  updateOrderStatus: (orderId, status) => {
    const orders = ordersManager.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      storage.set("orders", orders);
    }
  }
};

// === Менеджер продуктов ===
const productManager = {
  getProducts: () => {
    const stored = storage.get("products");
    return stored && stored.length > 0 ? stored : products;
  },

  setProducts: (prods) => storage.set("products", prods),

  getProduct: (id) => {
    const prods = productManager.getProducts();
    return prods.find((p) => p.id === Number.parseInt(id));
  },

  addProduct: (product) => {
    const prods = productManager.getProducts();
    product.id = Math.max(...prods.map((p) => p.id), 0) + 1;
    prods.push(product);
    productManager.setProducts(prods);
  },

  updateProduct: (id, updates) => {
    const prods = productManager.getProducts();
    const index = prods.findIndex((p) => p.id === id);
    if (index !== -1) {
      prods[index] = { ...prods[index], ...updates };
      productManager.setProducts(prods);
    }
  },

  deleteProduct: (id) => {
    let prods = productManager.getProducts();
    prods = prods.filter((p) => p.id !== id);
    productManager.setProducts(prods);
  },

  searchProducts: (query) => {
    const prods = productManager.getProducts();
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) return prods;

    return prods.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }
};

// === Инициализация ===
if (!storage.get("products")) {
  productManager.setProducts(products);
}

// === Обновление бейджей ===
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) {
    const count = cartManager.getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'block'; // Всегда показываем
  }
}

function updateFavoritesBadge() {
  const badge = document.getElementById('favoritesBadge');
  if (badge) {
    const count = favoritesManager.getFavorites().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'block'; // Всегда показываем
  }
}

function updateUserDisplay() {
  const userName = document.getElementById("userName");
  if (userName) {
    const user = userManager.getCurrentUser();
    userName.textContent = user ? user.name : "Профиль";
  }
}

// === Инициализация при загрузке ===
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  updateFavoritesBadge();
  updateUserDisplay();
});

// === Экспорты ===
export {
  userManager,
  cartManager,
  favoritesManager,
  ordersManager,
  productManager,
  updateCartBadge,
  updateFavoritesBadge,
};