// Declare cartManager, userManager, and ordersManager variables
const cartManager = {
  getCart: () => {
    // Implementation to get cart items
  },
  getTotal: () => {
    // Implementation to calculate total
  },
  updateQuantity: (productId, quantity) => {
    // Implementation to update quantity
  },
  removeFromCart: (productId) => {
    // Implementation to remove item from cart
  },
  clearCart: () => {
    // Implementation to clear cart
  },
}

const userManager = {
  getCurrentUser: () => {
    // Implementation to get current user
  },
}

const ordersManager = {
  addOrder: (order) => {
    // Implementation to add order
  },
}

function displayCart() {
  const cart = cartManager.getCart()
  const cartItems = document.getElementById("cartItems")
  const subtotal = document.getElementById("subtotal")
  const total = document.getElementById("total")

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <a href="catalog.html" class="btn-primary">Browse Products</a>
            </div>
        `
    subtotal.textContent = "$0.00"
    total.textContent = "$0.00"
    return
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="btn-danger" onclick="removeItem(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  const totalAmount = cartManager.getTotal()
  subtotal.textContent = `$${totalAmount.toFixed(2)}`
  total.textContent = `$${totalAmount.toFixed(2)}`
}

function updateQuantity(productId, quantity) {
  if (quantity < 1) {
    removeItem(productId)
    return
  }
  cartManager.updateQuantity(productId, quantity)
  displayCart()
}

function removeItem(productId) {
  if (confirm("Remove this item from cart?")) {
    cartManager.removeFromCart(productId)
    displayCart()
  }
}

// Place order
const placeOrderBtn = document.getElementById("placeOrderBtn")
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    const user = userManager.getCurrentUser()

    if (!user) {
      alert("Please login to place an order")
      window.location.href = "login.html"
      return
    }

    const cart = cartManager.getCart()
    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }

    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: cartManager.getTotal(),
      status: "pending",
      userEmail: user.email,
    }

    ordersManager.addOrder(order)
    cartManager.clearCart()

    alert("Order placed successfully!")
    window.location.href = "orders.html"
  })
}

displayCart()
