import { products } from './data.js';

class ProductManager {
  constructor(products) {
    this.products = products;
  }

  getProducts() {
    return this.products;
  }
}

// глобальный объект
window.productManager = new ProductManager(products);

// отображение товаров
const container = document.getElementById("products-container");

products.forEach(product => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>Рейтинг: ${"⭐".repeat(Math.floor(product.rating))} ${product.rating}</p>
    <p>${product.description}</p>
    <p>Цена: $${product.price}</p>
  `;

  container.appendChild(card);
});
