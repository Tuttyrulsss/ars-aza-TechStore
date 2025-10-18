// Declare userManager and ordersManager variables before using them
const userManager = window.userManager // Assuming userManager is available globally
const ordersManager = window.ordersManager // Assuming ordersManager is available globally

const user = userManager.getCurrentUser()

if (!user) {
  window.location.href = "../block/login.html"
} else {
  const orders = ordersManager.getOrders().filter((o) => o.userEmail === user.email)
  const ordersList = document.getElementById("ordersList")

  if (orders.length === 0) {
    ordersList.innerHTML = `
            <div class="empty-orders">
                <div class="empty-orders-icon">📦</div>
                <h2>No orders yet</h2>
                <p>Start shopping to see your orders here!</p>
                <a href="catalog.html" class="btn-primary">Browse Products</a>
            </div>
        `
  } else {
    ordersList.innerHTML = orders
      .map(
        (order) => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div style="color: #6b7280; font-size: 14px;">${new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div class="order-status ${order.status}">${order.status}</div>
                </div>
                <div class="order-items">
                    ${order.items
                      .map(
                        (item) => `
                        <div class="order-item">
                            <div class="order-item-image">${item.image}</div>
                            <div class="order-item-info">
                                <div>${item.name}</div>
                                <div style="color: #6b7280; font-size: 14px;">Quantity: ${item.quantity}</div>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
                <div class="order-total">Total: $${order.total.toFixed(2)}</div>
            </div>
        `,
      )
      .join("")
  }
}
