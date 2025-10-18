

export const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "phones",
    price: 999,
    rating: 4.8,
    description: "Latest iPhone with A17 Pro chip and titanium design",
    image: "img/iphon.jpg",
    popularity: 95,
  },
  {
    id: 2,
    name: "MacBook Pro 16",
    category: "laptops",
    price: 2499,
    rating: 4.9,
    description: "Powerful laptop with M3 Max chip for professionals",
    image: "img/iphon.jpg",
    popularity: 90,
  },
  {
    id: 3,
    name: "AirPods Pro",
    category: "accessories",
    price: 249,
    rating: 4.7,
    description: "Premium wireless earbuds with active noise cancellation",
    image: "img/iphon.jpg",
    popularity: 88,
  },
  {
    id: 4,
    name: "iPad Air",
    category: "tablets",
    price: 599,
    rating: 4.6,
    description: "Versatile tablet with M1 chip and stunning display",
    image: "img/iphon.jpg",
    popularity: 85,
  },
  {
    id: 5,
    name: "Apple Watch Ultra",
    category: "smartwatches",
    price: 799,
    rating: 4.8,
    description: "Rugged smartwatch for extreme adventures",
    image: "img/iphon.jpg",
    popularity: 82,
  },
  {
    id: 6,
    name: "Samsung Galaxy S24",
    category: "phones",
    price: 899,
    rating: 4.7,
    description: "Flagship Android phone with AI features",
    image: "img/iphon.jpg",
    popularity: 87,
  },
  {
    id: 7,
    name: "Dell XPS 15",
    category: "laptops",
    price: 1799,
    rating: 4.6,
    description: "Premium Windows laptop with stunning display",
    image: "img/iphon.jpg",
    popularity: 80,
  },
  {
    id: 8,
    name: "Sony WH-1000XM5",
    category: "accessories",
    price: 399,
    rating: 4.9,
    description: "Industry-leading noise cancelling headphones",
    image: "img/iphon.jpg",
    popularity: 92,
  },
]

// Storage helpers
const storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      return null
    }
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key) => {
    localStorage.removeItem(key)
  },
}

// User management
const userManager = {
  getCurrentUser: () => storage.get("currentUser"),
  setCurrentUser: (user) => storage.set("currentUser", user),
  logout: () => storage.remove("currentUser"),
  getUsers: () => storage.get("users") || [],
  addUser: (user) => {
    const users = userManager.getUsers()
    users.push(user)
    storage.set("users", users)
  },
  updateUser: (email, updates) => {
    const users = userManager.getUsers()
    const index = users.findIndex((u) => u.email === email)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      storage.set("users", users)
      if (userManager.getCurrentUser()?.email === email) {
        userManager.setCurrentUser(users[index])
      }
    }
  },
  findUser: (email) => {
    const users = userManager.getUsers()
    return users.find((u) => u.email === email)
  },
}

// Cart management
const cartManager = {
  getCart: () => storage.get("cart") || [],
  addToCart: (product, quantity = 1) => {
    const cart = cartManager.getCart()
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }

    storage.set("cart", cart)
    updateCartBadge()
  },
  updateQuantity: (productId, quantity) => {
    const cart = cartManager.getCart()
    const item = cart.find((item) => item.id === productId)
    if (item) {
      item.quantity = quantity
      storage.set("cart", cart)
      updateCartBadge()
    }
  },
  removeFromCart: (productId) => {
    let cart = cartManager.getCart()
    cart = cart.filter((item) => item.id !== productId)
    storage.set("cart", cart)
    updateCartBadge()
  },
  clearCart: () => {
    storage.set("cart", [])
    updateCartBadge()
  },
  getTotal: () => {
    const cart = cartManager.getCart()
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  },
}

// Orders management
const ordersManager = {
  getOrders: () => storage.get("orders") || [],
  addOrder: (order) => {
    const orders = ordersManager.getOrders()
    orders.unshift(order)
    storage.set("orders", orders)
  },
}

// Product management
const productManager = {
  getProducts: () => storage.get("products") || products,
  setProducts: (prods) => storage.set("products", prods),
  getProduct: (id) => {
    const prods = productManager.getProducts()
    return prods.find((p) => p.id === Number.parseInt(id))
  },
  addProduct: (product) => {
    const prods = productManager.getProducts()
    product.id = Math.max(...prods.map((p) => p.id), 0) + 1
    prods.push(product)
    productManager.setProducts(prods)
  },
  updateProduct: (id, updates) => {
    const prods = productManager.getProducts()
    const index = prods.findIndex((p) => p.id === id)
    if (index !== -1) {
      prods[index] = { ...prods[index], ...updates }
      productManager.setProducts(prods)
    }
  },
  deleteProduct: (id) => {
    let prods = productManager.getProducts()
    prods = prods.filter((p) => p.id !== id)
    productManager.setProducts(prods)
  },
}

// Initialize products if not exists
if (!storage.get("products")) {
  productManager.setProducts(products)
}

// Update cart badge
function updateCartBadge() {
  const badge = document.getElementById("cartBadge")
  if (badge) {
    const cart = cartManager.getCart()
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    badge.textContent = count
  }
}

// Update user display
function updateUserDisplay() {
  const userName = document.getElementById("userName")
  if (userName) {
    const user = userManager.getCurrentUser()
    userName.textContent = user ? user.name : "Профиль"
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge()
  updateUserDisplay()
})
