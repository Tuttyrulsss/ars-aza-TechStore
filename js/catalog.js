// Import productManager or declare it before using
const productManager = {
  getProducts: () => {
    // Dummy implementation for demonstration purposes
    return [
      {
        id: 1,
        category: "electronics",
        name: "Laptop",
        description: "A high-performance laptop",
        price: 999,
        rating: 4.5,
        popularity: 100,
      },
      {
        id: 2,
        category: "clothing",
        name: "T-Shirt",
        description: "A comfortable cotton t-shirt",
        price: 19,
        rating: 4.0,
        popularity: 50,
      },
      // Add more products as needed
    ]
  },
}

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search)
const categoryParam = urlParams.get("category")
const searchParam = urlParams.get("search")

// Set initial filters
const categoryFilter = document.getElementById("categoryFilter")
const sortFilter = document.getElementById("sortFilter")

if (categoryParam && categoryFilter) {
  categoryFilter.value = categoryParam
}

// Filter and display products
function displayProducts() {
  const category = categoryFilter.value
  const sort = sortFilter.value
  const search = searchParam ? searchParam.toLowerCase() : ""

  let prods = productManager.getProducts()

  // Filter by category
  if (category !== "all") {
    prods = prods.filter((p) => p.category === category)
  }

  // Filter by search
  if (search) {
    prods = prods.filter((p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search))
  }

  // Sort products
  switch (sort) {
    case "price-low":
      prods.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      prods.sort((a, b) => b.price - a.price)
      break
    case "rating":
      prods.sort((a, b) => b.rating - a.rating)
      break
    case "popularity":
      prods.sort((a, b) => b.popularity - a.popularity)
      break
  }

  const catalogGrid = document.getElementById("catalogGrid")

  if (prods.length === 0) {
    catalogGrid.innerHTML = '<div style="text-align: center; padding: 60px 20px;"><h2>No products found</h2></div>'
    return
  }

  catalogGrid.innerHTML = prods
    .map(
      (product) => `
        <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
            <div class="product-image">${product.image}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-rating">${"⭐".repeat(Math.floor(product.rating))} ${product.rating}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-price">$${product.price}</div>
        </div>
    `,
    )
    .join("")
}

// Event listeners
if (categoryFilter) {
  categoryFilter.addEventListener("change", displayProducts)
}

if (sortFilter) {
  sortFilter.addEventListener("change", displayProducts)
}

// Initial display
displayProducts()
