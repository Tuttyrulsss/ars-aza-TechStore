// catalog.js

class CatalogManager {
  constructor() {
    // Загружаем продукты — либо из data.js, либо из localStorage
    this.products = window.productManager
      ? window.productManager.getProducts()
      : this.getProductsFromStorage();

    this.filteredProducts = [...this.products];
    this.init();
  }

  getProductsFromStorage() {
    try {
      return JSON.parse(localStorage.getItem("products")) || [];
    } catch {
      return [];
    }
  }

  init() {
    console.log("CatalogManager initialized, products:", this.products);
    this.renderProducts();
    this.setupEventListeners();
    this.setupCatalogMenu();
    this.applyUrlFilters();
    this.updateCartBadge();
  }

  renderProducts() {
    const container = document.getElementById("catalogGrid");
    if (!container) {
      console.error("Container #catalogGrid not found!");
      return;
    }

    console.log("Rendering products:", this.filteredProducts);

    if (this.filteredProducts.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div style="font-size: 80px; margin-bottom: 20px;">😔</div>
          <h3>No products found</h3>
          <p>Try changing your filters or search terms</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredProducts
      .map((product) => {
        const stars = "⭐".repeat(Math.floor(product.rating));

        return `
          <div class="product-card" data-id="${product.id}">
            <div class="product-image">
              ${product.image && product.image.includes(".")
            ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover;">`
            : "📱"
          }
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">${stars} ${product.rating}</div>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="btn-primary btn-block add-to-cart" data-id="${product.id}">
              Add to Cart
            </button>
          </div>
        `;
      })
      .join("");

    this.setupProductInteractions();
  }

  setupProductInteractions() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const product = this.products.find((p) => p.id == id);
        if (product) {
          this.addToCart(product);
          alert(`${product.name} added to cart!`);
        }
      });
    });
  }

  addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateCartBadge();
  }

  updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const badge = document.getElementById("cartBadge");
    if (badge) badge.textContent = cart.length;
  }

  applyUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (category) {
      this.filteredProducts = this.products.filter((p) =>
        p.category?.toLowerCase().includes(category.toLowerCase())
      );
      this.renderProducts();
    }
  }

  setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        this.filteredProducts = this.products.filter((p) =>
          p.name.toLowerCase().includes(value)
        );
        this.renderProducts();
      });
    }
  }

  setupCatalogMenu() {
    const btn = document.getElementById("catalogBtn");
    const menu = document.getElementById("catalogMenu");

    if (!btn || !menu) {
      console.warn("Catalog menu or button not found!");
      return;
    }

    btn.addEventListener("click", () => {
      menu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && e.target !== btn) {
        menu.classList.remove("active");
      }
    });
  }
}

// === Запуск после загрузки DOM ===
document.addEventListener("DOMContentLoaded", () => {
  // даем чуть времени для data.js
  setTimeout(() => {
    new CatalogManager();
  }, 100);
});
