// Import or declare userManager and productManager here
const userManager = require("./data.js").userManager
const productManager = require("./data.js").productManager

const user = userManager.getCurrentUser()

// Check if user is admin (for demo, allow access if logged in)
if (!user) {
  window.location.href = "login.html"
}

// Tab switching
const adminNav = document.querySelectorAll(".admin-nav a[data-tab]")
adminNav.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const tab = link.dataset.tab

    adminNav.forEach((l) => l.classList.remove("active"))
    link.classList.add("active")

    document.querySelectorAll(".admin-section").forEach((section) => {
      section.style.display = "none"
    })

    document.getElementById(`${tab}Section`).style.display = "block"
  })
})

// Products management
function loadProducts() {
  const products = productManager.getProducts()
  const tbody = document.getElementById("productsTableBody")

  tbody.innerHTML = products
    .map(
      (product) => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

// Users management
function loadUsers() {
  const users = userManager.getUsers()
  const tbody = document.getElementById("usersTableBody")

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td>${user.email}</td>
            <td>${user.name}</td>
            <td><span class="user-status ${user.blocked ? "blocked" : "active"}">${user.blocked ? "Blocked" : "Active"}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="toggleUserBlock('${user.email}')">${user.blocked ? "Unblock" : "Block"}</button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

// Modal
const modal = document.getElementById("productModal")
const closeModal = document.getElementById("closeModal")
const addProductBtn = document.getElementById("addProductBtn")
const productForm = document.getElementById("productForm")

addProductBtn.addEventListener("click", () => {
  document.getElementById("modalTitle").textContent = "Add Product"
  productForm.reset()
  document.getElementById("productId").value = ""
  modal.classList.add("active")
})

closeModal.addEventListener("click", () => {
  modal.classList.remove("active")
})

productForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const id = document.getElementById("productId").value
  const product = {
    name: document.getElementById("productName").value,
    category: document.getElementById("productCategory").value,
    price: Number.parseFloat(document.getElementById("productPrice").value),
    description: document.getElementById("productDescription").value,
    image: document.getElementById("productImage").value,
    rating: 4.5,
    popularity: 50,
  }

  if (id) {
    productManager.updateProduct(Number.parseInt(id), product)
  } else {
    productManager.addProduct(product)
  }

  modal.classList.remove("active")
  loadProducts()
})

function editProduct(id) {
  const product = productManager.getProduct(id)

  document.getElementById("modalTitle").textContent = "Edit Product"
  document.getElementById("productId").value = product.id
  document.getElementById("productName").value = product.name
  document.getElementById("productCategory").value = product.category
  document.getElementById("productPrice").value = product.price
  document.getElementById("productDescription").value = product.description
  document.getElementById("productImage").value = product.image

  modal.classList.add("active")
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    productManager.deleteProduct(id)
    loadProducts()
  }
}

function toggleUserBlock(email) {
  const user = userManager.findUser(email)
  userManager.updateUser(email, { blocked: !user.blocked })
  loadUsers()
}

// Initial load
loadProducts()
loadUsers()
